import { IsString, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { KycLevel } from '../schemas/kyc.schema';

export class CreateKycDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsString()
  nationality: string;

  @IsString()
  documentType: string;

  @IsString()
  documentNumber: string;

  @IsString()
  documentFrontImage: string;

  @IsString()
  documentBackImage: string;

  @IsString()
  selfieImage: string;

  @IsEnum(KycLevel)
  @IsOptional()
  level?: KycLevel;
}
