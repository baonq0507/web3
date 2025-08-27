import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuditService } from '../audit.service';
import { AuditAction, AuditResource } from '../schemas/audit-log.schema';
import { Request } from 'express';

export interface AuditOptions {
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details?: string;
  captureRequestBody?: boolean;
  captureResponseBody?: boolean;
  skipSuccessLog?: boolean;
}

export const AUDIT_KEY = 'audit_options';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const auditOptions: AuditOptions = Reflect.getMetadata(AUDIT_KEY, handler);

    if (!auditOptions) {
      return next.handle();
    }

    const startTime = Date.now();
    const user = (request as any).user;
    const ipAddress = this.getIpAddress(request);
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap((response) => {
        const executionTime = Date.now() - startTime;
        
        // Log successful operation
        if (!auditOptions.skipSuccessLog) {
          this.auditService.log({
            userId: user?.id,
            action: auditOptions.action,
            resource: auditOptions.resource,
            resourceId: auditOptions.resourceId,
            details: auditOptions.details,
            ipAddress,
            userAgent,
            success: true,
            metadata: {
              executionTime,
              method: request.method,
              url: request.url,
              ...(auditOptions.captureRequestBody && { requestBody: request.body }),
              ...(auditOptions.captureResponseBody && { responseBody: response }),
            },
          });
        }
      }),
      catchError((error) => {
        const executionTime = Date.now() - startTime;
        
        // Log failed operation
        this.auditService.log({
          userId: user?.id,
          action: auditOptions.action,
          resource: auditOptions.resource,
          resourceId: auditOptions.resourceId,
          details: auditOptions.details,
          ipAddress,
          userAgent,
          success: false,
          errorMessage: error.message || 'Unknown error',
          metadata: {
            executionTime,
            method: request.method,
            url: request.url,
            statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            ...(auditOptions.captureRequestBody && { requestBody: request.body }),
          },
        });

        return throwError(() => error);
      }),
    );
  }

  private getIpAddress(request: Request): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    ) as string;
  }
}
