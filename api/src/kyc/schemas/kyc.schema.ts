import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type KycDocument = Kyc & Document;

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review'
}

export enum KycLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3'
}

@Schema({ timestamps: true })
export class Kyc {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: true })
  documentType: string; // passport, national_id, driving_license

  @Prop({ required: true })
  documentNumber: string;

  @Prop({ required: true })
  documentFrontImage: string;

  @Prop({ required: true })
  documentBackImage: string;

  @Prop({ required: true })
  selfieImage: string;

  @Prop({ type: String, enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Prop({ type: String, enum: KycLevel, default: KycLevel.LEVEL_1 })
  level: KycLevel;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  notes?: string;
}

export const KycSchema = SchemaFactory.createForClass(Kyc);
