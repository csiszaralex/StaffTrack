import { PickType } from '@nestjs/swagger';
import { UserEntityDto } from './userEntity.dto';

export class SignInUserDto extends PickType(UserEntityDto, ['email', 'password']) {}
