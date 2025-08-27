import { IsString, IsEnum, IsOptional } from 'class-validator';
import { DepositStatus } from '../schemas/deposit.schema';

export class ReviewDepositDto {
  @IsEnum(DepositStatus)
  status: DepositStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
