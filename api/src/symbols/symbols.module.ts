import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';
import { Symbol, SymbolSchema } from './schemas/symbol.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Symbol.name, schema: SymbolSchema }
    ])
  ],
  controllers: [SymbolsController],
  providers: [SymbolsService],
  exports: [SymbolsService]
})
export class SymbolsModule {}
