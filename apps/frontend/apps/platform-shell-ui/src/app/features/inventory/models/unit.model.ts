export interface Unit {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  symbol?: string;
  type: 'base' | 'derived';
  baseUnitId?: number;
  baseUnit?: Unit;
  conversionFactor?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUnitDto {
  code: string;
  name: string;
  nameEn?: string;
  symbol?: string;
  type: 'base' | 'derived';
  baseUnitId?: number;
  conversionFactor?: number;
  isActive?: boolean;
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> {
  id: number;
}
