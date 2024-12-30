import { Body, Delete, Get, HttpStatus, NotFoundException, Patch, Post, Res } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Response } from 'express';
import { AuthController } from 'src/auth/decorator/authMethod.decorator';
import { OnlyAdmin } from 'src/auth/decorator/onlyAdmin.decorator';
import { Id } from 'src/utils/id.decorator';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
import { PermissionService } from './permission.service';

@AuthController('Permission')
@OnlyAdmin()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }
  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }
  @Get(':id')
  async findOne(@Id() id: number): Promise<Permission> {
    const permision = await this.permissionService.findOne(id);
    if (!permision) throw new NotFoundException(`Permission with id ${id} not found`);
    return permision;
  }
  @Patch(':id')
  async update(
    @Id() id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionService.update(id, updatePermissionDto);
    if (!permission) throw new NotFoundException(`Permission with id ${id} not found`);
    return permission;
  }
  @Delete(':id')
  async remove(@Id() id: number, @Res() res: Response): Promise<void> {
    const deleted = await this.permissionService.remove(id);
    if (!deleted) res.status(HttpStatus.NO_CONTENT);
    res.send();
  }
}
