/**
 * حالات عملية الجرد
 */
export enum CountStatus {
  /**
   * مسودة - تم إنشاء الجرد ولم يبدأ بعد
   */
  DRAFT = 'DRAFT',

  /**
   * قيد التنفيذ - جاري عملية الجرد
   */
  IN_PROGRESS = 'IN_PROGRESS',

  /**
   * مكتمل - تم إتمام الجرد بنجاح
   */
  COMPLETED = 'COMPLETED',

  /**
   * ملغي - تم إلغاء عملية الجرد
   */
  CANCELLED = 'CANCELLED',
}

/**
 * حالة صنف في الجرد
 */
export enum CountItemStatus {
  /**
   * متطابق - الكمية المعدودة تطابق الكمية في النظام
   */
  MATCHED = 'MATCHED',

  /**
   * زيادة - الكمية المعدودة أكثر من الكمية في النظام
   */
  SURPLUS = 'SURPLUS',

  /**
   * نقص - الكمية المعدودة أقل من الكمية في النظام
   */
  SHORTAGE = 'SHORTAGE',

  /**
   * لم يتم العد - لم يتم عد هذا الصنف بعد
   */
  NOT_COUNTED = 'NOT_COUNTED',
}

/**
 * دالة مساعدة للحصول على وصف حالة الجرد بالعربية
 */
export function getCountStatusLabel(status: CountStatus): string {
  const labels: Record<CountStatus, string> = {
    [CountStatus.DRAFT]: 'مسودة',
    [CountStatus.IN_PROGRESS]: 'قيد التنفيذ',
    [CountStatus.COMPLETED]: 'مكتمل',
    [CountStatus.CANCELLED]: 'ملغي',
  };
  return labels[status];
}

/**
 * دالة مساعدة للحصول على وصف حالة الصنف في الجرد بالعربية
 */
export function getCountItemStatusLabel(status: CountItemStatus): string {
  const labels: Record<CountItemStatus, string> = {
    [CountItemStatus.MATCHED]: 'متطابق',
    [CountItemStatus.SURPLUS]: 'زيادة',
    [CountItemStatus.SHORTAGE]: 'نقص',
    [CountItemStatus.NOT_COUNTED]: 'لم يتم العد',
  };
  return labels[status];
}

/**
 * دالة مساعدة لتحديد حالة الصنف بناءً على الفرق
 */
export function determineCountItemStatus(
  systemQuantity: number,
  countedQuantity: number | null,
): CountItemStatus {
  if (countedQuantity === null) {
    return CountItemStatus.NOT_COUNTED;
  }

  const difference = countedQuantity - systemQuantity;

  if (difference === 0) {
    return CountItemStatus.MATCHED;
  } else if (difference > 0) {
    return CountItemStatus.SURPLUS;
  } else {
    return CountItemStatus.SHORTAGE;
  }
}
