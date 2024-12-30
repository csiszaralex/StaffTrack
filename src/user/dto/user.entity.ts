import { type Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserEntity implements Prisma.UserCreateInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  salt: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isAdmin?: boolean = false;
}
