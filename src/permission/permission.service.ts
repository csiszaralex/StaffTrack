import { Injectable } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.prisma.permission.create({ data: createPermissionDto });
  }
  async findAll(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }
  async findOne(id: number): Promise<Permission | null> {
    return this.prisma.permission.findUnique({ where: { id } });
  }
  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission | null> {
    const permission = await this.findOne(id);
    if (!permission) return null;
    return this.prisma.permission.update({ where: { id }, data: updatePermissionDto });
  }
  async remove(id: number): Promise<boolean> {
    const permission = await this.findOne(id);
    if (!permission) return false;
    await this.prisma.permission.delete({ where: { id } });
    return true;
  }
}
