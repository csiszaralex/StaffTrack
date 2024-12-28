import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionType } from '@prisma/client';
import { AppSubjects, CaslAbilityFactory } from '../casl-ability.factory';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get<PermissionType>('permission', context.getHandler());
    const subject = this.reflector.get<AppSubjects>('subject', context.getClass());
    if (!action || !subject) return true;

    const request = context.switchToHttp().getRequest();
    const paramId: number = +request.params.id;
    if (Number.isNaN(paramId) && request.params.id)
      throw new BadRequestException('Érvénytelen azonosító');

    if (subject === 'Position') {
      const ability = await this.caslAbilityFactory.createForPosition(request.user);
      return ability.can(action, subject);
    }

    return true;
  }
}
