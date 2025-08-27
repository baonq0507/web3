import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('symbols')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SymbolsController {
  constructor(private readonly symbolsService: SymbolsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async create(@Body() createSymbolDto: CreateSymbolDto) {
    return await this.symbolsService.create(createSymbolDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    const [symbols, total] = await Promise.all([
      this.symbolsService.findAll(query),
      this.symbolsService.count(query)
    ]);

    return {
      data: symbols,
      total,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10,
      totalPages: Math.ceil(total / (parseInt(query.limit) || 10))
    };
  }

  @Get('active')
  async findActive() {
    return await this.symbolsService.findAll({ isActive: true, limit: 100 });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.symbolsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateSymbolDto: UpdateSymbolDto) {
    return await this.symbolsService.update(id, updateSymbolDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.symbolsService.remove(id);
  }
}
