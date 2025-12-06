/**
 * أنواع حركات المخزون
 */
export enum MovementType {
  /**
   * إدخال - إضافة مخزون للمستودع
   */
  IN = 'IN',

  /**
   * إخراج - إخراج مخزون من المستودع
   */
  OUT = 'OUT',

  /**
   * تحويل - نقل مخزون بين مستودعات
   */
  TRANSFER = 'TRANSFER',

  /**
   * تسوية - تعديل الرصيد (زيادة أو نقصان)
   */
  ADJUSTMENT = 'ADJUSTMENT',
}

/**
 * أنواع المراجع للحركات
 */
export enum ReferenceType {
  /**
   * شراء - حركة ناتجة عن أمر شراء
   */
  PURCHASE = 'PURCHASE',

  /**
   * بيع - حركة ناتجة عن أمر بيع
   */
  SALE = 'SALE',

  /**
   * إنتاج - حركة ناتجة عن عملية إنتاج
   */
  PRODUCTION = 'PRODUCTION',

  /**
   * مرتجع - حركة ناتجة عن مرتجع (شراء أو بيع)
   */
  RETURN = 'RETURN',

  /**
   * تالف - حركة ناتجة عن تلف بضاعة
   */
  DAMAGE = 'DAMAGE',

  /**
   * فاقد - حركة ناتجة عن فقدان بضاعة
   */
  LOSS = 'LOSS',

  /**
   * موجود - حركة ناتجة عن إيجاد بضاعة (جرد)
   */
  FOUND = 'FOUND',
}

/**
 * دالة مساعدة للحصول على وصف نوع الحركة بالعربية
 */
export function getMovementTypeLabel(type: MovementType): string {
  const labels: Record<MovementType, string> = {
    [MovementType.IN]: 'إدخال',
    [MovementType.OUT]: 'إخراج',
    [MovementType.TRANSFER]: 'تحويل',
    [MovementType.ADJUSTMENT]: 'تسوية',
  };
  return labels[type];
}

/**
 * دالة مساعدة للحصول على وصف نوع المرجع بالعربية
 */
export function getReferenceTypeLabel(type: ReferenceType): string {
  const labels: Record<ReferenceType, string> = {
    [ReferenceType.PURCHASE]: 'شراء',
    [ReferenceType.SALE]: 'بيع',
    [ReferenceType.PRODUCTION]: 'إنتاج',
    [ReferenceType.RETURN]: 'مرتجع',
    [ReferenceType.DAMAGE]: 'تالف',
    [ReferenceType.LOSS]: 'فاقد',
    [ReferenceType.FOUND]: 'موجود',
  };
  return labels[type];
}
