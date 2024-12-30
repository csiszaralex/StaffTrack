import { PermissionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class PermissionDetailDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  permissionId: number;

  @IsEnum(PermissionType)
  type: PermissionType;
}
