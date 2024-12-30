import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Permission, PermissionType, Position, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJwtPayload } from './interface/jwtPayload.interface';

export type AppSubjects = Subjects<{
  Position: Position;
  User: User;
  Permission: Permission;
}>;
type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly prisma: PrismaService) {}

  async createForPosition(currentUser: IJwtPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (currentUser.isAdmin) {
      can(PermissionType.manage, 'Position');
    }

    const permissions = await this.prisma.userPermission.findMany({
      where: { userId: currentUser.id },
      include: { permission: true },
    });

    permissions.forEach(p => {
      if (p.permission.name === 'Position') {
        can(p.type, 'Position');
      }
    });

    return build();
  }

  async createForUser(currentUser: IJwtPayload, targerUserId: number, adminRelated = false) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (currentUser.isAdmin) {
      can(PermissionType.manage, 'User');
    }

    const permissions = await this.prisma.userPermission.findMany({
      where: { userId: currentUser.id },
      include: { permission: true },
    });

    permissions.forEach(p => {
      if (p.permission.name === 'User') {
        can(p.type, 'User');
      }
    });

    if (currentUser.id === targerUserId) {
      can(PermissionType.read, 'User');
      can(PermissionType.update, 'User');
    }

    return build();
  }

  async createForPermission(currentUser: IJwtPayload) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (currentUser.isAdmin) can(PermissionType.manage, 'Permission');

    return build();
  }
}
