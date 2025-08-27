import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
// TODO: Uncomment these strategies when they are implemented
// import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
// import { LocalStrategy } from './strategies/local.strategy';
// import { TwoFactorStrategy } from './strategies/two-factor.strategy';

import { UsersModule } from '../users/users.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    UsersModule,
    AuditModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // TODO: Uncomment these strategies when they are implemented
    // LocalStrategy,
    JwtStrategy,
    // JwtRefreshStrategy,
    // TwoFactorStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
