import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditRead } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @AuditRead(AuditResource.SYSTEM, 'Get dashboard statistics')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('users')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @AuditRead(AuditResource.SYSTEM, 'Get user statistics report')
  getUserStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getUserStats(start, end);
  }

  @Get('transactions')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @AuditRead(AuditResource.SYSTEM, 'Get transaction statistics report')
  getTransactionStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getTransactionStats(start, end);
  }

  @Get('kyc')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @AuditRead(AuditResource.SYSTEM, 'Get KYC statistics report')
  getKycStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getKycStats(start, end);
  }

  @Get(':type')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  @AuditRead(AuditResource.SYSTEM, 'Generate custom report')
  generateReport(
    @Query('type') type: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.generateReport(type, start, end);
  }
}
