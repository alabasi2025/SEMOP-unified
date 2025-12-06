// unified-backend-monorepo/src/modules/accounting/journal-entry/journal-entry.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; // Assuming PrismaService path

// Interface for the input data to the stored procedure
interface JournalEntryInput {
  entry_date: string;
  description: string;
  lines: Array<{
    account_code: string;
    debit: number;
    credit: number;
  }>;
}

// Interface for the output from the stored procedure
interface StoredProcedureResult {
  success: boolean;
  message: string;
  journal_entry_id: number;
}

@Injectable()
export class JournalEntryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calls the PostgreSQL stored procedure to post a Journal Entry.
   * @param data The journal entry data.
   * @returns The result from the stored procedure.
   */
  async postJournalEntry(data: JournalEntryInput): Promise<StoredProcedureResult> {
    // Convert the input object to a JSON string, then cast it to jsonb in the SQL query.
    const jsonPayload = JSON.stringify(data);

    // Use Prisma's $queryRaw to call the function and get the structured result.
    // NOTE: The function returns a TABLE, so $queryRaw is appropriate.
    const result: StoredProcedureResult[] = await this.prisma.$queryRaw<StoredProcedureResult[]>`
      SELECT * FROM post_journal_entry(${jsonPayload}::jsonb);
    `;

    if (result.length === 0) {
      throw new Error('Stored procedure returned no result.');
    }

    return result[0];
  }

  // Other service methods...
}

// NOTE: This file is a conceptual representation. Actual implementation requires
// proper NestJS module setup, Prisma schema definition, and error handling.
