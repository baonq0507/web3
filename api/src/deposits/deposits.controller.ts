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
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ReviewDepositDto } from './dto/review-deposit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { DepositStatus } from './schemas/deposit.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditCreate, AuditRead, AuditDelete, AuditApprove } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('deposits')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditCreate(AuditResource.DEPOSIT, 'Create deposit request')
  create(@Body() createDepositDto: CreateDepositDto, @Request() req) {
    return this.depositsService.create(createDepositDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.DEPOSIT, 'List all deposits')
  findAll(
    @Query('status') status?: DepositStatus,
    @Query('userId') userId?: string
  ) {
    return this.depositsService.findAll(status, userId);
  }

  @Get('stats')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  getStats() {
    return this.depositsService.getStats();
  }

  @Get('my')
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditRead(AuditResource.DEPOSIT, 'Get my deposits')
  findMyDeposits(@Request() req) {
    return this.depositsService.findByUserId(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.DEPOSIT, 'Get deposit details')
  findOne(@Param('id') id: string) {
    return this.depositsService.findOne(id);
  }

  @Patch(':id/review')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditApprove(AuditResource.DEPOSIT, 'Review deposit request')
  review(
    @Param('id') id: string,
    @Body() reviewDepositDto: ReviewDepositDto,
    @Request() req
  ) {
    return this.depositsService.review(id, reviewDepositDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditDelete(AuditResource.DEPOSIT, 'Delete deposit request')
  remove(@Param('id') id: string) {
    return this.depositsService.remove(id);
  }
}
