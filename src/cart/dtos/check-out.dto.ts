import { IsUUID } from 'class-validator';

export class CheckOutDto {
  @IsUUID()
  addressId: string;
}
