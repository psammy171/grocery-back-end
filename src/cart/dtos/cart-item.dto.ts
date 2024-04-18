import { IsUUID } from 'class-validator';

export class CartItemDto {
  @IsUUID()
  itemId: string;
}
