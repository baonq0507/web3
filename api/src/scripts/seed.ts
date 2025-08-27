import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole, UserStatus, KycStatus } from '../users/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const usersService = app.get(UsersService);

  console.log('🌱 Starting database seeding...');

  try {
    // Create superadmin
    const superadminEmail = 'superadmin@cryptotrading.com';
    const existingSuperadmin = await usersService.findByEmail(superadminEmail);
    
    if (!existingSuperadmin) {
      await usersService.create({
        email: superadminEmail,
        password: '12345678',
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPERADMIN,
        status: UserStatus.ACTIVE,
        kycStatus: KycStatus.APPROVED,
        adminNotes: 'Default superadmin account created during seeding',
      });
      
      console.log('✅ Superadmin created:', superadminEmail);
    } else {
      console.log('ℹ️  Superadmin already exists:', superadminEmail);
    }

    // Create admin user
    const adminEmail = 'admin@cryptotrading.com';
    const existingAdmin = await usersService.findByEmail(adminEmail);
    
    if (!existingAdmin) {
      await usersService.create({
        email: adminEmail,
        password: '12345678',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        kycStatus: KycStatus.APPROVED,
        adminNotes: 'Default admin account created during seeding',
      });
      
      console.log('✅ Admin user created:', adminEmail);
    } else {
      console.log('ℹ️  Admin user already exists:', adminEmail);
    }

    // Create support user
    const supportEmail = 'support@cryptotrading.com';
    const existingSupport = await usersService.findByEmail(supportEmail);
    
    if (!existingSupport) {
      await usersService.create({
        email: supportEmail,
        password: '12345678',
        firstName: 'Support',
        lastName: 'Agent',
        role: UserRole.SUPPORT,
        status: UserStatus.ACTIVE,
        kycStatus: KycStatus.APPROVED,
        adminNotes: 'Default support account created during seeding',
      });
      
      console.log('✅ Support user created:', supportEmail);
    } else {
      console.log('ℹ️  Support user already exists:', supportEmail);
    }

    // Create auditor user
    const auditorEmail = 'auditor@cryptotrading.com';
    const existingAuditor = await usersService.findByEmail(auditorEmail);
    
    if (!existingAuditor) {
      await usersService.create({
        email: auditorEmail,
        password: '12345678',
        firstName: 'Auditor',
        lastName: 'User',
        role: UserRole.AUDITOR,
        status: UserStatus.ACTIVE,
        kycStatus: KycStatus.APPROVED,
        adminNotes: 'Default auditor account created during seeding',
      });
      
      console.log('✅ Auditor user created:', auditorEmail);
    } else {
      console.log('ℹ️  Auditor user already exists:', auditorEmail);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default accounts created:');
    console.log('   Superadmin: superadmin@cryptotrading.com / 12345678');
    console.log('   Admin: admin@cryptotrading.com / 12345678');
    console.log('   Support: support@cryptotrading.com / 12345678');
    console.log('   Auditor: auditor@cryptotrading.com / 12345678');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
