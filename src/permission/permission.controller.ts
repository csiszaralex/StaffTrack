import { Body, HttpStatus, NotFoundException, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Response } from 'express';
import {
  AuthController,
  DeleteAuth,
  GetAuth,
  PatchAuth,
  PostAuth,
} from 'src/auth/decorator/authMethod.decorator';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
import { PermissionService } from './permission.service';

@AuthController('Permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @PostAuth()
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionService.create(createPermissionDto);
  }

  @GetAuth()
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @GetAuth(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
    const permision = await this.permissionService.findOne(id);
    if (!permision) throw new NotFoundException(`Permission with id ${id} not found`);
    return permision;
  }

  @PatchAuth(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionService.update(id, updatePermissionDto);
    if (!permission) throw new NotFoundException(`Permission with id ${id} not found`);
    return permission;
  }

  @DeleteAuth(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<void> {
    const deleted = await this.permissionService.remove(id);
    if (!deleted) res.status(HttpStatus.NO_CONTENT);
    res.send();
  }
}
