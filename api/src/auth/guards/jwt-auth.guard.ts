import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  private readonly publicRoutes = [
    '/api/admin/v1/auth/login',
    '/api/admin/v1/auth/refresh',
  ];
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    if (this.publicRoutes.includes(url)) {
      return true;
    }

    return super.canActivate(context);
  }
}
