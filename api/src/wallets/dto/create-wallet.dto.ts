import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  address: string;

  @IsString()
  currency: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsEnum(['hot', 'cold'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
