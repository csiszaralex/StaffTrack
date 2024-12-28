import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { PermissionType, Position } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJwtPayload } from './interface/jwtPayload.interface';

export type AppSubjects = Subjects<{
  Position: Position;
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
}
