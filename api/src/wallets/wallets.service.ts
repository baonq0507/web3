import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async create(createWalletDto: CreateWalletDto, userId: string): Promise<Wallet> {
    const wallet = new this.walletModel({
      ...createWalletDto,
      userId: new Types.ObjectId(userId),
    });
    return wallet.save();
  }

  async findAll(userId?: string): Promise<Wallet[]> {
    const filter = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.walletModel.find(filter).populate('userId', 'email username').exec();
  }

  async findOne(id: string): Promise<Wallet> {
    const wallet = await this.walletModel.findById(id).populate('userId', 'email username').exec();
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    const wallet = await this.walletModel.findByIdAndUpdate(id, updateWalletDto, { new: true });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async remove(id: string): Promise<void> {
    const result = await this.walletModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Wallet not found');
    }
  }

  async updateBalance(id: string, amount: number, isLocked: boolean = false): Promise<Wallet> {
    const update = isLocked 
      ? { $inc: { lockedBalance: amount } }
      : { $inc: { balance: amount } };
    
    const wallet = await this.walletModel.findByIdAndUpdate(id, update, { new: true });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }
}
