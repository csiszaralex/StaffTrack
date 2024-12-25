import { type Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class PositionEntityDto implements Prisma.PositionCreateInput {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
