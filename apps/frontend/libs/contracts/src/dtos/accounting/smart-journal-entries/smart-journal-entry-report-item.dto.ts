export class SmartJournalEntryReportItemDto {
  id: string;
  date: string; // تاريخ القيد
  description: string; // وصف القيد
  status: 'Pending' | 'Approved' | 'Rejected'; // حالة القيد
  sourceModule: string; // الوحدة المصدر (مثل المبيعات، المشتريات، الموارد البشرية)
  totalDebit: number; // إجمالي المدين
  totalCredit: number; // إجمالي الدائن
  // تفاصيل الحسابات المتأثرة
  accountEntries: {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
}
