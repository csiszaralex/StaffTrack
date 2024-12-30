import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '@prisma/client';

export function Permission(...permissions: PermissionType[]) {
  return SetMetadata('permission', permissions);
}
