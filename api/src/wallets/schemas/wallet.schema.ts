import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  lockedBalance: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, enum: ['hot', 'cold'], default: 'hot' })
  type: string;

  @Prop()
  label?: string;

  @Prop()
  description?: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
