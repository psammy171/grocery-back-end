import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateGroceryDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;
}
