import { IsString, IsEnum, IsOptional } from 'class-validator';
import { WithdrawalStatus } from '../schemas/withdrawal.schema';

export class ReviewWithdrawalDto {
  @IsEnum(WithdrawalStatus)
  status: WithdrawalStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  txHash?: string;
}
