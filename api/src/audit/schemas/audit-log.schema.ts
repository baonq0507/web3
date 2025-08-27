import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  APPROVE = 'approve',
  REJECT = 'reject',
  TRANSFER = 'transfer',
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit'
}

export enum AuditResource {
  USER = 'user',
  WALLET = 'wallet',
  KYC = 'kyc',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRADE = 'trade',
  SYSTEM = 'system'
}

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  action: AuditAction;

  @Prop({ required: true })
  resource: AuditResource;

  @Prop()
  resourceId?: string;

  @Prop()
  details?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  oldValues?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  newValues?: any;

  @Prop({ default: true })
  success: boolean;

  @Prop()
  errorMessage?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
