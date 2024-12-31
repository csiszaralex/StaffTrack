import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Employee, User } from '@prisma/client';
import { Response } from 'express';
import { DeleteAuth, GetAuth, PatchAuth, PostAuth } from 'src/auth/decorator/authMethod.decorator';
import { AuthorizationSubject } from 'src/auth/decorator/authorizationSubject.decorator';
import { OnlyAdmin } from 'src/auth/decorator/onlyAdmin.decorator';
import { Permission } from 'src/auth/decorator/permission.decorator';
import { CreateEmployeeDto } from 'src/employee/dto/createEmpleyee.dto';
import { ExcludeFields } from 'src/utils/excludeFields.interceptor';
import { Id } from 'src/utils/id.decorator';
import { User as GetUser } from './decorator/User.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserEmployeeDto } from './dto/createUserEmployee.dto';
import { PermissionDetailDto } from './dto/permissionDetail.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('User')
@AuthorizationSubject('User')
@ExcludeFields(['password', 'salt'])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PostAuth()
  createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser('isAdmin') admin: boolean,
  ): Promise<User> {
    return this.userService.createUser(createUserDto, admin);
  }

  @PostAuth('employee')
  createUserEmployee(
    @Body() createUserEmployeeDto: CreateUserEmployeeDto,
    @GetUser('isAdmin') admin: boolean,
  ) {
    return this.userService.createUserEmployee(createUserEmployeeDto, admin);
  }

  @PatchAuth(':id?')
  async updateUser(@Id() id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userService.updateUser(id, updateUserDto);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  //TODO: run autoclean every 30 day and remove exited users
  @DeleteAuth(':id')
  async removeUser(@Id() id: number, @Res() res: Response): Promise<void> {
    const deleted = await this.userService.removeUser(id);
    if (!deleted) res.status(HttpStatus.NO_CONTENT);
    res.send();
  }

  @Get('promote/:id/:value?')
  @OnlyAdmin()
  async promoteUser(
    @Id() id: number,
    @Param('value') value: string,
    @Res() res: Response,
  ): Promise<void> {
    const val = !(value === 'false');
    const done = await this.userService.promoteUser(id, val);
    if (!done) res.status(HttpStatus.NO_CONTENT);
    res.send();
  }

  @PostAuth('detach/:id')
  async detachUser(@Id() id: number, @Res() res: Response): Promise<void> {
    const done = await this.userService.detachUser(id);
    if (!done) res.status(HttpStatus.NO_CONTENT);
    else res.status(HttpStatus.OK);
    res.send();
  }
  @PostAuth('attach/:id')
  async attachUser(
    @Id() id: number,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.userService.attachUser(id, createEmployeeDto);
  }

  @GetAuth()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @GetAuth(':id')
  async getMyUser(@Id() id: number): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @GetAuth('permission/:id')
  @AuthorizationSubject('Permission')
  async findUserPermissions(@Id() id: number): Promise<PermissionDetailDto[]> {
    return this.userService.findUserPermissions(id);
  }
  @Put('permission/:id')
  @Permission('create')
  @AuthorizationSubject('Permission')
  async assignPermission(
    @Id() id: number,
    @Body() permissionDetailDto: PermissionDetailDto,
  ): Promise<void> {
    const p = await this.userService.assignPermissionToUser(id, permissionDetailDto);
    if (!p) throw new ConflictException('Permission already assigned');
  }
  @DeleteAuth('permission/:id')
  @AuthorizationSubject('Permission')
  async removePermission(@Id() id: number, @Res() res: Response): Promise<void> {
    const deleted = await this.userService.removePermission(id);
    if (!deleted) res.status(HttpStatus.NO_CONTENT);
    res.send();
  }
  @Post('permission/:id')
  @AuthorizationSubject('Permission')
  @Permission('create', 'delete')
  async createPermission(
    @Id() id: number,
    @Body('permissions') permissions: PermissionDetailDto[],
  ): Promise<void> {
    return this.userService.setPermissions(id, permissions);
  }
}
