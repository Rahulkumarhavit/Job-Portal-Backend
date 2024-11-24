import {
  IsNotEmpty,
  IsOptional,
  isString,
  IsString,
  IsUrl,
} from 'class-validator';

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @isString()
  location?: string;

  @IsOptional()
  @isString()
  logo?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @isString()
  location?: string;

  @IsOptional()
  @isString()
  logo?: string;
}
