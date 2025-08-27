import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DepositDocument = Deposit & Document;

export enum DepositStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Deposit {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  txHash: string;

  @Prop({ required: true })
  fromAddress: string;

  @Prop({ required: true })
  toAddress: string;

  @Prop({ type: String, enum: DepositStatus, default: DepositStatus.PENDING })
  status: DepositStatus;

  @Prop()
  blockNumber?: number;

  @Prop()
  confirmations?: number;

  @Prop()
  rejectionReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  notes?: string;

  @Prop({ default: 0 })
  fee: number;

  @Prop({ default: 0 })
  netAmount: number;
}

export const DepositSchema = SchemaFactory.createForClass(Deposit);
