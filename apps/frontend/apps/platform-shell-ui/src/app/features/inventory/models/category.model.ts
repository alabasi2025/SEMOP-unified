export interface Category {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  level: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: number;
}
