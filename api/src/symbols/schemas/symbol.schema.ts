import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SymbolDocument = Symbol & Document;

export enum SymbolType {
  CRYPTO = 'crypto',
  FOREX = 'forex'
}

@Schema({ timestamps: true })
export class Symbol {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, enum: SymbolType, default: SymbolType.CRYPTO })
  type: SymbolType;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const SymbolSchema = SchemaFactory.createForClass(Symbol);
