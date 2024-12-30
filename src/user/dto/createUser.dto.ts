import { OmitType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class CreateUserDto extends OmitType(UserEntity, ['salt']) {}
