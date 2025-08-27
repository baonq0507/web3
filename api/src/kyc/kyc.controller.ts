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
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { KycStatus } from './schemas/kyc.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditCreate, AuditRead, AuditUpdate, AuditDelete, AuditApprove, AuditReject } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditCreate(AuditResource.KYC, 'Submit KYC application')
  create(@Body() createKycDto: CreateKycDto, @Request() req) {
    return this.kycService.create(createKycDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.KYC, 'List all KYC applications')
  findAll(
    @Query('status') status?: KycStatus,
    @Query('userId') userId?: string
  ) {
    return this.kycService.findAll(status, userId);
  }

  @Get('stats')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  getStats() {
    return this.kycService.getStats();
  }

  @Get('my')
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditRead(AuditResource.KYC, 'Get my KYC status')
  findMyKyc(@Request() req) {
    return this.kycService.findByUserId(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditRead(AuditResource.KYC, 'Get KYC details')
  findOne(@Param('id') id: string) {
    return this.kycService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.VIP, UserRole.PREMIUM)
  @AuditUpdate(AuditResource.KYC, 'Update KYC information')
  update(@Param('id') id: string, @Body() updateKycDto: UpdateKycDto, @Request() req) {
    // Users can only update their own KYC
    return this.kycService.update(id, updateKycDto);
  }

  @Patch(':id/review')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.SUPPORT)
  @AuditApprove(AuditResource.KYC, 'Review KYC application')
  review(
    @Param('id') id: string,
    @Body() reviewKycDto: ReviewKycDto,
    @Request() req
  ) {
    return this.kycService.review(id, reviewKycDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @AuditDelete(AuditResource.KYC, 'Delete KYC application')
  remove(@Param('id') id: string) {
    return this.kycService.remove(id);
  }
}
