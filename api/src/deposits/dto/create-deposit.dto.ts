import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDepositDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  txHash: string;

  @IsString()
  fromAddress: string;

  @IsString()
  toAddress: string;

  @IsNumber()
  @IsOptional()
  fee?: number;

  @IsNumber()
  @IsOptional()
  blockNumber?: number;

  @IsNumber()
  @IsOptional()
  confirmations?: number;
}
