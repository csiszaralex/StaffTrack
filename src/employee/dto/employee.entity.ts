import { Sex, type Prisma } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsString, Length } from 'class-validator';

export class EmployeeEntity implements Prisma.EmployeeCreateInput {
  @IsString()
  phone: string;

  @IsString()
  fullName: string;

  @IsString()
  motherName: string;

  @IsString()
  @IsOptional()
  birthName?: string;

  @IsISO8601({ strict: true })
  birthDate: string | Date;

  @IsString()
  placeOfBirth: string;

  @IsString()
  nationality = 'Hungarian';

  @IsEnum(Sex)
  sex: Sex;

  @IsString()
  taxId: string;

  @IsString()
  @Length(9)
  TAJ: string;

  @IsString()
  Address: string;

  user: Prisma.UserCreateNestedOneWithoutEmployeeInput;
}
