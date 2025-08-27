import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditCreate, AuditRead, AuditUpdate, AuditDelete } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('wallets')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditCreate(AuditResource.WALLET, 'Create new wallet')
  create(@Body() createWalletDto: CreateWalletDto, @Request() req) {
    return this.walletsService.create(createWalletDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.WALLET, 'List all wallets')
  findAll(@Query('userId') userId?: string) {
    return this.walletsService.findAll(userId);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.WALLET, 'Get wallet details')
  findOne(@Param('id') id: string) {
    return this.walletsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditUpdate(AuditResource.WALLET, 'Update wallet information')
  update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
    return this.walletsService.update(id, updateWalletDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditDelete(AuditResource.WALLET, 'Delete wallet')
  remove(@Param('id') id: string) {
    return this.walletsService.remove(id);
  }

  @Patch(':id/balance')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditUpdate(AuditResource.WALLET, 'Update wallet balance')
  updateBalance(
    @Param('id') id: string,
    @Body() body: { amount: number; isLocked?: boolean }
  ) {
    return this.walletsService.updateBalance(id, body.amount, body.isLocked);
  }
}
