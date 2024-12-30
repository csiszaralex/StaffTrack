import { type Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class PermissionEntity implements Prisma.PermissionCreateInput {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
