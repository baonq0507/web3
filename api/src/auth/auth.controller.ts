import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Get,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TwoFactorDto } from './dto/two-factor.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UserStatus } from '../users/schemas/user.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditLogin, AuditLogout } from '../audit/decorators/audit.decorator';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(AuditInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @AuditLogin('User login attempt')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    // Validate user credentials first
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active using _doc if available
    const userData = user._doc || user;
    if (userData.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    // Return login response
    return this.authService.login(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<RefreshResponseDto> {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify 2FA code' })
  @ApiBody({ type: TwoFactorDto })
  @ApiResponse({
    status: 200,
    description: '2FA verified successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verifyTwoFactor(
    @Req() req,
    @Body() twoFactorDto: TwoFactorDto,
  ): Promise<LoginResponseDto> {
    return this.authService.verifyTwoFactor(req.user.id, twoFactorDto.code);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA for user' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async enableTwoFactor(@Req() req, @Body() body: { userId: string }) {
    return this.authService.enableTwoFactor(body.userId);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable 2FA for user' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async disableTwoFactor(@Req() req, @Body() body: { userId: string }) {
    return this.authService.disableTwoFactor(body.userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @AuditLogout('User logout')
  async logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@Req() req) {
    console.log('req.user:', req.user);
    console.log('req.user.id:', req.user.id);
    console.log('req.user.id type:', typeof req.user.id);
    return this.authService.getProfile(req.user.id);
  }
}
