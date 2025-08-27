import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isValidPassword = await this.usersService.validatePassword(password, user.password);
      if (isValidPassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    // Use helper method to get user data with _doc preference
    const userData = this.usersService.getUserData(user);
    
    const payload = { email: userData.email, sub: userData._id.toString() };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 3600, // 1 hour in seconds
      user: {
        id: userData._id.toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,
        role: userData.role,
        status: userData.status,
        kycStatus: userData.kycStatus,
        twoFactorEnabled: userData.twoFactorEnabled || false,
        lastLoginAt: userData.lastLoginAt,
        createdAt: userData.createdAt,
      },
      requiresTwoFactor: false,
      message: 'Login successful',
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new Error('User not found');
      }
      return this.login(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async verifyTwoFactor(userId: string, code: string) {
    // TODO: Implement 2FA verification
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.login(user);
  }

  async enableTwoFactor(userId: string) {
    // TODO: Implement 2FA enable
    return { enabled: true };
  }

  async disableTwoFactor(userId: string) {
    // TODO: Implement 2FA disable
    return { disabled: true };
  }

  async logout(userId: string) {
    // TODO: Implement logout logic
    return { loggedOut: true };
  }

  async getProfile(userId: string) {
    console.log('getProfile called with userId:', userId);
    console.log('userId type:', typeof userId);
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Use helper method to get user data with _doc preference
    const userData = this.usersService.getUserData(user);
    const { password, ...result } = userData;
    return result;
  }
}
