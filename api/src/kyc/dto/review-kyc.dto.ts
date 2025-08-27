import { IsString, IsEnum, IsOptional } from 'class-validator';
import { KycStatus } from '../schemas/kyc.schema';

export class ReviewKycDto {
  @IsEnum(KycStatus)
  status: KycStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
