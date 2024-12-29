import { ApiProperty } from '@nestjs/swagger';
import { type Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class PositionEntityDto implements Prisma.PositionCreateInput {
  @IsString()
  @ApiProperty({ example: 'Waiter' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'A waiter in a restaurant' })
  description?: string;
}
