import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  SUPPORT = 'support',
  AUDITOR = 'auditor',
  USER = 'user',
  VIP = 'vip',
  PREMIUM = 'premium',
  BASIC = 'basic',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
  PENDING_KYC = 'pending_kyc',
}

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NOT_SUBMITTED = 'not_submitted',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Transform(({ value }) => value.toString())
  declare _id: Types.ObjectId;
  
  // Add _doc property for direct access
  declare _doc?: any;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phone?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.SUPPORT })
  role: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.PENDING_KYC })
  status: UserStatus;

  @Prop({ enum: KycStatus, default: KycStatus.NOT_SUBMITTED })
  kycStatus: KycStatus;

  @Prop()
  kycRejectionReason?: string;

  @Prop()
  @Exclude()
  twoFactorSecret?: string;

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  @Exclude()
  refreshToken?: string;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  lastLoginIp?: string;

  @Prop()
  adminNotes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  referredBy?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  referrals: Types.ObjectId[];

  @Prop({ default: 0 })
  referralCount: number;

  @Prop()
  @Exclude()
  passwordResetToken?: string;

  @Prop()
  @Exclude()
  passwordResetExpires?: Date;

  @Prop({ default: false })
  forcePasswordReset: boolean;

  @Prop({ type: [String], default: [] })
  @Exclude()
  activeSessions: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  @Exclude()
  __v: number;

  // Virtual for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Virtual for isActive
  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  // Virtual for canTrade
  get canTrade(): boolean {
    return this.status === UserStatus.ACTIVE && this.kycStatus === KycStatus.APPROVED;
  }
  
  // Method to get _doc directly
  getDoc(): any {
    return this._doc || this.toObject();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
// Note: email index is automatically created by unique: true in @Prop
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ kycStatus: 1 });
UserSchema.index({ referredBy: 1 });
UserSchema.index({ createdAt: -1 });

// Virtuals
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('isActive').get(function() {
  return this.status === UserStatus.ACTIVE;
});

UserSchema.virtual('canTrade').get(function() {
  return this.status === UserStatus.ACTIVE && this.kycStatus === KycStatus.APPROVED;
});

// Ensure virtuals are serialized
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Enable _doc access
UserSchema.set('toObject', { 
  virtuals: true,
  getters: true,
  transform: function(doc, ret) {
    // Expose _doc directly
    if (doc._doc) {
      Object.assign(ret, doc._doc);
    }
    return ret;
  }
});

// Add a method to get _doc directly
UserSchema.methods.getDoc = function() {
  return this._doc || this.toObject();
};
