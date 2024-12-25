import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  controllers: [PositionController],
  providers: [PositionService],
  imports: [PrismaModule],
})
export class PositionModule {}
