import { SmartJournalEntryReportItemDto } from './smart-journal-entry-report-item.dto';

export class SmartJournalEntryReportResponseDto {
  totalCount: number;
  items: SmartJournalEntryReportItemDto[];
  // يمكن إضافة ملخصات إضافية هنا مثل إجمالي المدين/الدائن للتقرير
  totalReportDebit: number;
  totalReportCredit: number;
}
