import { type Prisma } from '@prisma/client';
import { IsString } from 'class-validator';

export class PermissionEntity implements Prisma.PermissionCreateInput {
  @IsString()
  name: string;

  @IsString()
  description?: string;
}
