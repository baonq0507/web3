import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Global prefix
  app.setGlobalPrefix('api/admin/v1');
  
  // Static file serving for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  
  // Basic CORS configuration - Detailed CORS handled by middleware
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
      'X-Client-Version',
      'X-Platform',
    ],
    exposedHeaders: ['Content-Length', 'X-Total-Count', 'X-API-Version'],
  });

  // Security headers
  app.use((req, res, next) => {
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Crypto Trading Admin API')
    .setDescription('Admin API for Crypto Trading Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('wallets', 'Wallet management endpoints')
    .addTag('kyc', 'KYC management endpoints')
    .addTag('deposits', 'Deposit management endpoints')
    .addTag('withdrawals', 'Withdrawal management endpoints')
    .addTag('trading', 'Trading configuration endpoints')
    .addTag('options', 'Options trading endpoints')
    .addTag('price-feed', 'Price feed endpoints')
    .addTag('audit', 'Audit log endpoints')
    .addTag('reports', 'Reports endpoints')
    .addTag('invites', 'Invitation management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`🔐 Auth endpoint: http://localhost:${port}/api/admin/v1/auth/login`);
  console.log(`🌐 CORS enabled for all origins in development mode`);
}

bootstrap();
