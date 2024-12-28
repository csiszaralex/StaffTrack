import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '@prisma/client';

export function Permission(permission: PermissionType) {
  return SetMetadata('permission', permission);
}
