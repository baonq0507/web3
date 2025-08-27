import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus, KycStatus } from '../../users/schemas/user.schema';

export class UserProfileDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User full name' })
  fullName: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ description: 'KYC status', enum: KycStatus })
  kycStatus: KycStatus;

  @ApiProperty({ description: 'Whether 2FA is enabled' })
  twoFactorEnabled: boolean;

  @ApiProperty({ description: 'Last login date' })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expiresIn: number;

  @ApiProperty({ description: 'User profile information' })
  user: UserProfileDto;

  @ApiProperty({ description: 'Whether 2FA verification is required' })
  requiresTwoFactor: boolean;

  @ApiProperty({ description: 'Message for user' })
  message: string;
}
