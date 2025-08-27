import { SetMetadata } from '@nestjs/common';
import { AuditAction, AuditResource } from '../schemas/audit-log.schema';
import { AuditOptions, AUDIT_KEY } from '../interceptors/audit.interceptor';

export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options);

// Helper decorators for common audit actions
export const AuditCreate = (resource: AuditResource, details?: string) =>
  Audit({ action: AuditAction.CREATE, resource, details });

export const AuditRead = (resource: AuditResource, details?: string) =>
  Audit({ action: AuditAction.READ, resource, details });

export const AuditUpdate = (resource: AuditResource, details?: string) =>
  Audit({ action: AuditAction.UPDATE, resource, details });

export const AuditDelete = (resource: AuditResource, details?: string) =>
  Audit({ action: AuditAction.DELETE, resource, details });

export const AuditLogin = (details?: string) =>
  Audit({ action: AuditAction.LOGIN, resource: AuditResource.USER, details });

export const AuditLogout = (details?: string) =>
  Audit({ action: AuditAction.LOGOUT, resource: AuditResource.USER, details });

export const AuditApprove = (resource: AuditResource, details?: string) =>
  Audit({ action: AuditAction.APPROVE, resource, details });

export const AuditReject = (resource: AuditResource, details?: string) =>
  Audit({ action: AuditAction.REJECT, resource, details });

export const AuditTransfer = (details?: string) =>
  Audit({ action: AuditAction.TRANSFER, resource: AuditResource.WALLET, details });

export const AuditWithdraw = (details?: string) =>
  Audit({ action: AuditAction.WITHDRAW, resource: AuditResource.WITHDRAWAL, details });

export const AuditDeposit = (details?: string) =>
  Audit({ action: AuditAction.DEPOSIT, resource: AuditResource.DEPOSIT, details });
