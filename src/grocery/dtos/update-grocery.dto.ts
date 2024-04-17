import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateGroceryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsBoolean()
  archived: boolean;
}
