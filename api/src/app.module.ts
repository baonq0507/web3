import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { KycModule } from './kyc/kyc.module';
import { DepositsModule } from './deposits/deposits.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';
import { SymbolsModule } from './symbols/symbols.module';
import { validationSchema } from './config/validation-schema';
import { CorsMiddleware } from './middleware/cors.middleware';
// TODO: Uncomment these modules when they are implemented
// import { TradingModule } from './trading/trading.module';
// import { OptionsModule } from './options/options.module';
// import { PriceFeedModule } from './price-feed/price-feed.module';
// import { InvitesModule } from './invites/invites.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-trading'),
    // TODO: Uncomment when Redis is available
    // BullModule.forRoot({
    //   redis: {
    //     host: process.env.REDIS_HOST || 'localhost',
    //     port: parseInt(process.env.REDIS_PORT || '6379'),
    //     password: process.env.REDIS_PASSWORD,
    //   },
    // }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    WalletsModule,
    KycModule,
    DepositsModule,
    WithdrawalsModule,
    AuditModule,
    ReportsModule,
    SymbolsModule,
    // TODO: Uncomment these modules when they are implemented
    // TradingModule,
    // OptionsModule,
    // PriceFeedModule,
    // InvitesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
