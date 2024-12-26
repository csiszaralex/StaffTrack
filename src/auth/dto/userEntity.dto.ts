import { type Prisma } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class UserEntityDto implements Prisma.UserCreateInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  salt: string;

  // role?: $Enums.Role | undefined;
  // createdAt?: string | Date | undefined;
  // updatedAt?: string | Date | undefined;
  // employee?: Prisma.EmployeeCreateNestedOneWithoutUserInput | undefined;
  // cards?: Prisma.CardCreateNestedManyWithoutUserInput | undefined;
}
