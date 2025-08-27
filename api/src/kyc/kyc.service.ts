import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Kyc, KycDocument, KycStatus } from './schemas/kyc.schema';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';

@Injectable()
export class KycService {
  constructor(
    @InjectModel(Kyc.name) private kycModel: Model<KycDocument>,
  ) {}

  async create(createKycDto: CreateKycDto, userId: string): Promise<Kyc> {
    // Check if user already has a KYC application
    const existingKyc = await this.kycModel.findOne({ userId: new Types.ObjectId(userId) });
    if (existingKyc) {
      throw new BadRequestException('User already has a KYC application');
    }

    const kyc = new this.kycModel({
      ...createKycDto,
      userId: new Types.ObjectId(userId),
    });
    return kyc.save();
  }

  async findAll(status?: KycStatus, userId?: string): Promise<Kyc[]> {
    const filter: any = {};
    if (status) filter.status = status;
    if (userId) filter.userId = new Types.ObjectId(userId);

    return this.kycModel.find(filter)
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .exec();
  }

  async findOne(id: string): Promise<Kyc> {
    const kyc = await this.kycModel.findById(id)
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .exec();
    
    if (!kyc) {
      throw new NotFoundException('KYC application not found');
    }
    return kyc;
  }

  async findByUserId(userId: string): Promise<Kyc> {
    const kyc = await this.kycModel.findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'email username')
      .populate('reviewedBy', 'email username')
      .exec();
    
    if (!kyc) {
      throw new NotFoundException('KYC application not found');
    }
    return kyc;
  }

  async update(id: string, updateKycDto: UpdateKycDto): Promise<Kyc> {
    const kyc = await this.kycModel.findByIdAndUpdate(id, updateKycDto, { new: true });
    if (!kyc) {
      throw new NotFoundException('KYC application not found');
    }
    return kyc;
  }

  async review(id: string, reviewKycDto: ReviewKycDto, reviewerId: string): Promise<Kyc> {
    const kyc = await this.kycModel.findByIdAndUpdate(
      id,
      {
        ...reviewKycDto,
        reviewedBy: new Types.ObjectId(reviewerId),
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!kyc) {
      throw new NotFoundException('KYC application not found');
    }
    return kyc;
  }

  async remove(id: string): Promise<void> {
    const result = await this.kycModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('KYC application not found');
    }
  }

  async getStats(): Promise<any> {
    const stats = await this.kycModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await this.kycModel.countDocuments();
    
    return {
      total,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }
}
