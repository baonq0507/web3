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
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { ReviewWithdrawalDto } from './dto/review-withdrawal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { WithdrawalStatus } from './schemas/withdrawal.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditCreate, AuditRead, AuditDelete, AuditApprove } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditCreate(AuditResource.WITHDRAWAL, 'Create withdrawal request')
  create(@Body() createWithdrawalDto: CreateWithdrawalDto, @Request() req) {
    return this.withdrawalsService.create(createWithdrawalDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.WITHDRAWAL, 'List all withdrawals')
  findAll(
    @Query('status') status?: WithdrawalStatus,
    @Query('userId') userId?: string
  ) {
    return this.withdrawalsService.findAll(status, userId);
  }

  @Get('stats')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  getStats() {
    return this.withdrawalsService.getStats();
  }

  @Get('my')
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditRead(AuditResource.WITHDRAWAL, 'Get my withdrawals')
  findMyWithdrawals(@Request() req) {
    return this.withdrawalsService.findByUserId(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.WITHDRAWAL, 'Get withdrawal details')
  findOne(@Param('id') id: string) {
    return this.withdrawalsService.findOne(id);
  }

  @Patch(':id/review')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditApprove(AuditResource.WITHDRAWAL, 'Review withdrawal request')
  review(
    @Param('id') id: string,
    @Body() reviewWithdrawalDto: ReviewWithdrawalDto,
    @Request() req
  ) {
    return this.withdrawalsService.review(id, reviewWithdrawalDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditDelete(AuditResource.WITHDRAWAL, 'Delete withdrawal request')
  remove(@Param('id') id: string) {
    return this.withdrawalsService.remove(id);
  }
}
