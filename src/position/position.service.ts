import { Injectable } from '@nestjs/common';
import { Position } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePositionDto } from './dto/createPosition.dto';
import { UpdatePositionDto } from './dto/updatePosition.dto';

@Injectable()
export class PositionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    return this.prisma.position.create({ data: createPositionDto });
  }

  async findAll(): Promise<Position[]> {
    return this.prisma.position.findMany();
  }

  async findOne(id: number): Promise<Position | null> {
    return this.prisma.position.findUnique({ where: { id } });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto): Promise<Position | null> {
    const pos = await this.findOne(id);
    if (!pos) return null;
    return this.prisma.position.update({ where: { id }, data: updatePositionDto });
  }

  async remove(id: number): Promise<boolean> {
    const pos = await this.findOne(id);
    if (!pos) return false;
    await this.prisma.position.delete({ where: { id } });
    return true;
  }
}
