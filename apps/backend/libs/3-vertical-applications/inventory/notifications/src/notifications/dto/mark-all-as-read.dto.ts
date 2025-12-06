import { IsNumber } from 'class-validator';

export class MarkAllAsReadDto {
  @IsNumber()
  userId: number; // معرف المستخدم
}
