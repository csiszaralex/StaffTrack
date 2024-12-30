import { OmitType } from '@nestjs/swagger';
import { PermissionEntity } from './permission.entity';

export class CreatePermissionDto extends OmitType(PermissionEntity, []) {}
