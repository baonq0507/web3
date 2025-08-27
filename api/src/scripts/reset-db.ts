import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const connection = app.get<Connection>(getConnectionToken());

  console.log('🗑️  Starting database reset...');

  try {
    // Check if connection is ready
    if (!connection.db) {
      throw new Error('Database connection not ready');
    }

    // Get all collection names
    const collections = await connection.db.listCollections().toArray();
    
    console.log(`📋 Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Drop all collections
    for (const collection of collections) {
      console.log(`🗑️  Dropping collection: ${collection.name}`);
      await connection.db.dropCollection(collection.name);
    }

    console.log('✅ All collections dropped successfully!');
    console.log('🔄 Database reset completed!');
    console.log('\n💡 Now you can run the seed script: npm run seed');

  } catch (error) {
    console.error('❌ Error during database reset:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
