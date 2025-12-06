-- ==================================================================================
-- Function: post_journal_entry
-- Description: Processes a complete Journal Entry (JE), including lines, and updates GL balances.
-- Usage: SELECT post_journal_entry('{"entry_date": "2025-12-05", "description": "Monthly Rent Payment", "lines": [{"account_code": "5000", "debit": 1000.00, "credit": 0.00}, {"account_code": "1010", "debit": 0.00, "credit": 1000.00}]}'::jsonb);
-- ==================================================================================

CREATE OR REPLACE FUNCTION post_journal_entry(
    p_journal_entry_data jsonb
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    journal_entry_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_je_id INT;
    v_total_debit NUMERIC := 0;
    v_total_credit NUMERIC := 0;
    v_line jsonb;
    v_account_id INT;
    v_account_code TEXT;
BEGIN
    -- 1. Calculate total debit and credit to ensure balance
    SELECT SUM((line->>'debit')::NUMERIC), SUM((line->>'credit')::NUMERIC)
    INTO v_total_debit, v_total_credit
    FROM jsonb_array_elements(p_journal_entry_data->'lines') AS line;

    IF v_total_debit IS DISTINCT FROM v_total_credit THEN
        RETURN QUERY SELECT FALSE, 'Journal entry is not balanced. Total Debit: ' || v_total_debit || ', Total Credit: ' || v_total_credit, NULL;
        RETURN;
    END IF;

    -- Start Transaction (PL/pgSQL functions are implicitly transactional)

    -- 2. Insert the main Journal Entry record
    INSERT INTO journal_entries (entry_date, description, total_amount, status)
    VALUES (
        (p_journal_entry_data->>'entry_date')::DATE,
        p_journal_entry_data->>'description',
        v_total_debit,
        'Posted' -- Assuming the function posts it immediately
    )
    RETURNING id INTO v_je_id;

    -- 3. Loop through lines, insert, and update GL balances
    FOR v_line IN SELECT * FROM jsonb_array_elements(p_journal_entry_data->'lines')
    LOOP
        v_account_code := v_line->>'account_code';

        -- Get GL Account ID (Assuming a table named gl_accounts exists)
        SELECT id INTO v_account_id FROM gl_accounts WHERE account_code = v_account_code;

        IF v_account_id IS NULL THEN
            -- Rollback is implicit on error, but we can raise a custom error
            RAISE EXCEPTION 'GL Account with code % not found.', v_account_code;
        END IF;

        -- Insert Journal Entry Line
        INSERT INTO journal_entry_lines (journal_entry_id, gl_account_id, debit, credit)
        VALUES (
            v_je_id,
            v_account_id,
            (v_line->>'debit')::NUMERIC,
            (v_line->>'credit')::NUMERIC
        );

        -- Update GL Account Balance
        UPDATE gl_accounts
        SET current_balance = current_balance + (v_line->>'debit')::NUMERIC - (v_line->>'credit')::NUMERIC
        WHERE id = v_account_id;

    END LOOP;

    -- 4. Return success
    RETURN QUERY SELECT TRUE, 'Journal Entry posted successfully.', v_je_id;

END;
$$;
