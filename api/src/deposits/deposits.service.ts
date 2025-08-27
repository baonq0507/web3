import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deposit, DepositDocument, DepositStatus } from './schemas/deposit.schema';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ReviewDepositDto } from './dto/review-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(
    @InjectModel(Deposit.name) private depositModel: Model<DepositDocument>,
  ) {}

  async create(createDepositDto: CreateDepositDto, userId: string): Promise<Deposit> {
    const deposit = new this.depositModel({
      ...createDepositDto,
      userId: new Types.ObjectId(userId),
      netAmount: createDepositDto.amount - (createDepositDto.fee || 0),
    });
    return deposit.save();
  }

  async findAll(status?: DepositStatus, userId?: string): Promise<Deposit[]> {
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = new Types.ObjectId(userId);

    return this.depositModel.find(filter)
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Deposit> {
    const deposit = await this.depositModel.findById(id)
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .exec();
    
    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }
    return deposit;
  }

  async findByUserId(userId: string): Promise<Deposit[]> {
    return this.depositModel.find({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .sort({ createdAt: -1 })
      .exec();
  }

  async review(id: string, reviewDepositDto: ReviewDepositDto, reviewerId: string): Promise<Deposit> {
    const deposit = await this.depositModel.findByIdAndUpdate(
      id,
      {
        ...reviewDepositDto,
        reviewedBy: new Types.ObjectId(reviewerId),
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }
    return deposit;
  }

  async remove(id: string): Promise<void> {
    const result = await this.depositModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Deposit not found');
    }
  }

  async getStats(): Promise<any> {
    const stats = await this.depositModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const total = await this.depositModel.countDocuments();
    const totalAmount = await this.depositModel.aggregate([
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
