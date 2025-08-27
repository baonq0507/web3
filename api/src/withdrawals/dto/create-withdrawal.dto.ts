import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  toAddress: string;

  @IsNumber()
  @IsOptional()
  fee?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
