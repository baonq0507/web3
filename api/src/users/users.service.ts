import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserRole, UserStatus, KycStatus } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { AdminResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    if (!savedUser) {
      throw new BadRequestException('Failed to create user');
    }

    return savedUser;
  }

  async findAll(query: UserQueryDto) {
    console.log('query', query);
    const { page = 1, limit = 10, search, role, status, kycStatus, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (kycStatus) filter.kycStatus = kycStatus;

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('referredBy', 'firstName lastName email')
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<User> {
    console.log('findById called with id:', id);
    console.log('id type:', typeof id);
    
    // Validate if id is a valid ObjectId
    if (!Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel
      .findById(id)
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .populate('referredBy', 'firstName lastName email')
      .populate('referrals', 'firstName lastName email status')
      .exec();
    
    if (!user) {
      console.log('User not found in database for id:', id);
      throw new NotFoundException('User not found');
    }
    
    console.log('User found:', user._id);
    console.log('User _doc available:', !!user._doc);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user');
    }

    return updatedUser;
  }

  async updateStatus(id: string, status: UserStatus, reason?: string): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { status };
    
    if (status === UserStatus.SUSPENDED && reason) {
      updateData.adminNotes = `${user.adminNotes || ''}\n[${new Date().toISOString()}] Status changed to ${status}: ${reason}`;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user status');
    }

    return updatedUser;
  }

  async updateKycStatus(id: string, kycStatus: KycStatus, reason?: string): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { kycStatus };
    
    if (kycStatus === KycStatus.REJECTED && reason) {
      updateData.kycRejectionReason = reason;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to update user KYC status');
    }

    return updatedUser;
  }

  async forcePasswordReset(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { 
          forcePasswordReset: true,
          adminNotes: `${user.adminNotes || ''}\n[${new Date().toISOString()}] Force password reset requested`,
        },
        { new: true }
      )
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to force password reset');
    }

    return updatedUser;
  }

  async revokeSessions(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { 
          activeSessions: [],
          adminNotes: `${user.adminNotes || ''}\n[${new Date().toISOString()}] All sessions revoked`,
        },
        { new: true }
      )
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to revoke sessions');
    }

    return updatedUser;
  }

  async addAdminNote(id: string, note: string): Promise<User> {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { 
          adminNotes: `${user.adminNotes || ''}\n[${new Date().toISOString()}] ${note}`,
        },
        { new: true }
      )
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to add admin note');
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async getReferrals(id: string) {
    const user = await this.userModel.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const referrals = await this.userModel
      .find({ referredBy: id })
      .select('firstName lastName email status kycStatus createdAt')
      .sort({ createdAt: -1 })
      .exec();

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        referralCount: user.referralCount,
      },
      referrals,
    };
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  // Helper method to get user data with _doc preference
  getUserData(user: User): any {
    return user._doc || user.toObject();
  }

  async adminResetPassword(id: string, resetPasswordDto: AdminResetPasswordDto): Promise<{ newPassword: string; user: User }> {
    const user = await this.userModel.findById(id);

    console.log('user', user);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a new random password
    const newPassword = this.generateRandomPassword();
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user with new password and force reset flag
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { 
          password: hashedPassword,
          forcePasswordReset: true,
          adminNotes: `${user.adminNotes || ''}\n[${new Date().toISOString()}] Password reset by admin${resetPasswordDto.reason ? `: ${resetPasswordDto.reason}` : ''}`,
        },
        { new: true }
      )
      .select('-password -twoFactorSecret -refreshToken -passwordResetToken')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to reset password');
    }

    return {
      newPassword,
      user: updatedUser
    };
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
