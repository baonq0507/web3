import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Withdrawal, WithdrawalDocument, WithdrawalStatus } from './schemas/withdrawal.schema';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { ReviewWithdrawalDto } from './dto/review-withdrawal.dto';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<WithdrawalDocument>,
  ) {}

  async create(createWithdrawalDto: CreateWithdrawalDto, userId: string): Promise<Withdrawal> {
    const withdrawal = new this.withdrawalModel({
      ...createWithdrawalDto,
      userId: new Types.ObjectId(userId),
      netAmount: createWithdrawalDto.amount - (createWithdrawalDto.fee || 0),
    });
    return withdrawal.save();
  }

  async findAll(status?: WithdrawalStatus, userId?: string): Promise<Withdrawal[]> {
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = new Types.ObjectId(userId);

    return this.withdrawalModel.find(filter)
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalModel.findById(id)
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .exec();
    
    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }
    return withdrawal;
  }

  async findByUserId(userId: string): Promise<Withdrawal[]> {
    return this.withdrawalModel.find({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async review(id: string, reviewWithdrawalDto: ReviewWithdrawalDto, reviewerId: string): Promise<Withdrawal> {
    const updateData: any = {
      ...reviewWithdrawalDto,
      reviewedBy: new Types.ObjectId(reviewerId),
      reviewedAt: new Date(),
    };

    if (reviewWithdrawalDto.status === WithdrawalStatus.PROCESSING) {
      updateData.processedAt = new Date();
    } else if (reviewWithdrawalDto.status === WithdrawalStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    const withdrawal = await this.withdrawalModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }
    return withdrawal;
  }

  async remove(id: string): Promise<void> {
    const result = await this.withdrawalModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Withdrawal not found');
    }
  }

  async getStats(): Promise<any> {
    const stats = await this.withdrawalModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const total = await this.withdrawalModel.countDocuments();
    const totalAmount = await this.withdrawalModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    return {
      total,
      totalAmount: totalAmount[0]?.total || 0,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = { count: stat.count, amount: stat.totalAmount };
        return acc;
      }, {}),
    };
  }
}
