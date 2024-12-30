import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../user/dto/user.entity';

export class SignInUserDto extends PickType(UserEntity, ['email', 'password']) {}
