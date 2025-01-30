import { ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from '../interface/RequestWithUser.interface';

@Injectable()
export class OnlyAdminGuard {
  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    return request.user.isAdmin;
  }
}
