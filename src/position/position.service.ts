import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePositionDto } from './dto/createPosition.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPositionDto: CreatePositionDto) {
    return this.prisma.position.create({ data: createPositionDto });
  }

  findAll() {
    return this.prisma.position.findMany();
  }

  findOne(id: number) {
    return this.prisma.position.findUnique({ where: { id } });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    return this.prisma.position.update({
      where: { id },
      data: updatePositionDto,
    });
  }

  async remove(id: number) {
    return this.prisma.position.delete({ where: { id } });
  }
}
