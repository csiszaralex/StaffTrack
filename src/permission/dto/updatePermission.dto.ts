import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './createPermission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
