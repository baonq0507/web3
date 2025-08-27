import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Wallet } from '../wallets/schemas/wallet.schema';
import { Kyc } from '../kyc/schemas/kyc.schema';
import { Deposit } from '../deposits/schemas/deposit.schema';
import { Withdrawal } from '../withdrawals/schemas/withdrawal.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(Kyc.name) private kycModel: Model<Kyc>,
    @InjectModel(Deposit.name) private depositModel: Model<Deposit>,
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<Withdrawal>,
  ) {}

  async getDashboardStats(): Promise<any> {
    const [
      totalUsers,
      totalWallets,
      totalKyc,
      totalDeposits,
      totalWithdrawals,
      pendingKyc,
      pendingDeposits,
      pendingWithdrawals
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.walletModel.countDocuments(),
      this.kycModel.countDocuments(),
      this.depositModel.countDocuments(),
      this.withdrawalModel.countDocuments(),
      this.kycModel.countDocuments({ status: 'pending' }),
      this.depositModel.countDocuments({ status: 'pending' }),
      this.withdrawalModel.countDocuments({ status: 'pending' })
    ]);

    return {
      users: {
        total: totalUsers,
      },
      wallets: {
        total: totalWallets,
      },
      kyc: {
        total: totalKyc,
        pending: pendingKyc,
      },
      transactions: {
        deposits: {
          total: totalDeposits,
          pending: pendingDeposits,
        },
        withdrawals: {
          total: totalWithdrawals,
          pending: pendingWithdrawals,
        },
      },
    };
  }

  async getUserStats(startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const userStats = await this.userModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await this.userModel.countDocuments(filter);
    const newUsers = await this.userModel.countDocuments({
      ...filter,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    return {
      total: totalUsers,
      newThisWeek: newUsers,
      byRole: userStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }

  async getTransactionStats(startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const [depositStats, withdrawalStats] = await Promise.all([
      this.depositModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      this.withdrawalModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ])
    ]);

    const totalDeposits = await this.depositModel.countDocuments(filter);
    const totalWithdrawals = await this.withdrawalModel.countDocuments(filter);

    return {
      deposits: {
        total: totalDeposits,
        byStatus: depositStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, amount: stat.totalAmount };
          return acc;
        }, {}),
      },
      withdrawals: {
        total: totalWithdrawals,
        byStatus: withdrawalStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, amount: stat.totalAmount };
          return acc;
        }, {}),
      },
    };
  }

  async getKycStats(startDate?: Date, endDate?: Date): Promise<any> {
    const filter: any = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const kycStats = await this.kycModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalKyc = await this.kycModel.countDocuments(filter);
    const pendingKyc = await this.kycModel.countDocuments({
      ...filter,
      status: 'pending'
    });

    return {
      total: totalKyc,
      pending: pendingKyc,
      byStatus: kycStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }

  async generateReport(type: string, startDate?: Date, endDate?: Date): Promise<any> {
    switch (type) {
      case 'dashboard':
        return this.getDashboardStats();
      case 'users':
        return this.getUserStats(startDate, endDate);
      case 'transactions':
        return this.getTransactionStats(startDate, endDate);
      case 'kyc':
        return this.getKycStats(startDate, endDate);
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }
}
