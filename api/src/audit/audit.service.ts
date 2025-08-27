import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument, AuditAction, AuditResource } from './schemas/audit-log.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async log(data: {
    userId?: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
    oldValues?: any;
    newValues?: any;
    success?: boolean;
    errorMessage?: string;
    metadata?: any;
  }): Promise<AuditLog> {
    const auditLog = new this.auditLogModel({
      ...data,
      userId: data.userId ? new Types.ObjectId(data.userId) : undefined,
    });
    return auditLog.save();
  }

  async findAll(
    userId?: string,
    action?: AuditAction,
    resource?: AuditResource,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 50
  ): Promise<{ logs: AuditLog[]; total: number; page: number; totalPages: number }> {
    const filter: any = {};
    
    if (userId) filter.userId = new Types.ObjectId(userId);
    if (action) filter.action = action;
    if (resource) filter.resource = resource;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const total = await this.auditLogModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const logs = await this.auditLogModel.find(filter)
      .populate('userId', 'email username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      logs,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<AuditLog> {
    const auditLog = await this.auditLogModel.findById(id)
      .populate('userId', 'email username')
      .exec();
    
    if (!auditLog) {
      throw new NotFoundException('Audit log not found');
    }
    
    return auditLog;
  }

  async findByUserId(userId: string, limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogModel.find({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'email username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getStats(): Promise<any> {
    const actionStats = await this.auditLogModel.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    const resourceStats = await this.auditLogModel.aggregate([
      {
        $group: {
          _id: '$resource',
          count: { $sum: 1 }
        }
      }
    ]);

    const successStats = await this.auditLogModel.aggregate([
      {
        $group: {
          _id: '$success',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await this.auditLogModel.countDocuments();
    
    return {
      total,
      byAction: actionStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byResource: resourceStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      bySuccess: successStats.reduce((acc, stat) => {
        acc[stat._id ? 'success' : 'failed'] = stat.count;
        return acc;
      }, {}),
    };
  }

  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const result = await this.auditLogModel.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
    
    return result.deletedCount;
  }
}
