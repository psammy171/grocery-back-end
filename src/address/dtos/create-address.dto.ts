import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLineOne: string;
  @IsString()
  addressLineTwo: string;
  @IsString()
  @MinLength(3)
  city: string;
  @IsNumberString()
  @Length(6, 6)
  zipcode: string;
  @IsString()
  @IsOptional()
  label: string;
}
