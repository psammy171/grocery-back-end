import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateGroceryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
