import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { AuditAction, AuditResource } from './schemas/audit-log.schema';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: AuditAction,
    @Query('resource') resource?: AuditResource,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 50;

    return this.auditService.findAll(
      userId,
      action,
      resource,
      start,
      end,
      pageNum,
      limitNum
    );
  }

  @Get('stats')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  getStats() {
    return this.auditService.getStats();
  }

  @Get('my')
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM, UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT, UserRole.AUDITOR)
  findMyLogs(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 100;
    return this.auditService.findByUserId(req.user.id, limitNum);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.AUDITOR)
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }
}
