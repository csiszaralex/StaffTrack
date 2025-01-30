import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionType } from '@prisma/client';
import { AppSubjects, CaslAbilityFactory } from '../casl-ability.factory';
import { RequestWithUser } from '../interface/RequestWithUser.interface';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly logger = new Logger(AuthorizationGuard.name);
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const actions =
      this.reflector.get<PermissionType[]>('permission', context.getHandler()) ||
      this.reflector.get<PermissionType[]>('permission', context.getClass());
    const subject =
      this.reflector.get<AppSubjects>('subject', context.getHandler()) ||
      this.reflector.get<AppSubjects>('subject', context.getClass());
    if (!actions || !subject) return true;
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const paramId = parseInt(request.params.id);

    let ability;
    if (subject === 'Position')
      ability = await this.caslAbilityFactory.createForPosition(request.user);
    else if (subject === 'User')
      ability = await this.caslAbilityFactory.createForUser(request.user, paramId);
    else if (subject === 'Permission')
      ability = await this.caslAbilityFactory.createForPermission(request.user, paramId);
    else {
      this.logger.warn(`No ability for ${typeof subject === 'string' ? subject : 'ERROR'} subject`);
      return true;
    }
    return actions.every(action => ability.can(action, subject));
  }
}
