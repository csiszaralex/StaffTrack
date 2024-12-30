import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OnlyAdminGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user.isAdmin;
  }
}
