import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { AdminResetPasswordDto } from './dto/reset-password.dto';
import { UserStatus, KycStatus } from './schemas/user.schema';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditCreate, AuditRead, AuditUpdate, AuditDelete } from '../audit/decorators/audit.decorator';
import { AuditResource } from '../audit/schemas/audit-log.schema';

@Controller('users')
@UseInterceptors(AuditInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @AuditCreate(AuditResource.USER, 'Create new user')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @AuditRead(AuditResource.USER, 'List all users')
  async findAll(@Query() query: UserQueryDto) {
    console.log('query', query);
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @AuditRead(AuditResource.USER, 'Get user details')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @AuditUpdate(AuditResource.USER, 'Update user information')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @AuditDelete(AuditResource.USER, 'Delete user')
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Post(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() resetPasswordDto: AdminResetPasswordDto) {
    return this.usersService.adminResetPassword(id, resetPasswordDto);
  }

  @Post(':id/force-password-reset')
  async forcePasswordReset(@Param('id') id: string) {
    return this.usersService.forcePasswordReset(id);
  }

  @Post(':id/revoke-sessions')
  async revokeSessions(@Param('id') id: string) {
    return this.usersService.revokeSessions(id);
  }

  @Post(':id/admin-note')
  async addAdminNote(@Param('id') id: string, @Body() body: { note: string }) {
    return this.usersService.addAdminNote(id, body.note);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string; reason?: string }) {
    return this.usersService.updateStatus(id, body.status as UserStatus, body.reason);
  }

  @Put(':id/kyc-status')
  async updateKycStatus(@Param('id') id: string, @Body() body: { kycStatus: string; reason?: string }) {
    return this.usersService.updateKycStatus(id, body.kycStatus as KycStatus, body.reason);
  }

  @Get(':id/referrals')
  async getReferrals(@Param('id') id: string) {
    return this.usersService.getReferrals(id);
  }
}
