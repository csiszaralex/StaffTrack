import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Employee, User } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { CreateEmployeeDto } from 'src/employee/dto/createEmpleyee.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserEmployeeDto } from './dto/createUserEmployee.dto';
import { PermissionDetailDto } from './dto/permissionDetail.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly employeeService: EmployeeService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser(createUserDto: CreateUserDto, adminCalled: boolean): Promise<User> {
    const userExists = await this.findByEmail(createUserDto.email);
    if (userExists)
      throw new ConflictException(`User with email ${createUserDto.email} already exists`);
    if (createUserDto.isAdmin && !adminCalled)
      throw new ForbiddenException(`Only admin can create admin user`);

    const salt = await genSalt();
    const password = await hash(createUserDto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        salt,
        password,
        isAdmin: createUserDto.isAdmin || false,
      },
    });
    return user;
  }
  async createUserEmployee(createUserEmployeeDto: CreateUserEmployeeDto, adminCalled: boolean) {
    const user = await this.createUser(createUserEmployeeDto, adminCalled);
    const employee = await this.prisma.employee.findUnique({
      where: { userId: user.id },
    });
    if (employee) throw new ConflictException(`Employee with userId ${user.id} already exists`);
    await this.employeeService.create(createUserEmployeeDto, user.id);
    return await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { employee: true },
    });
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }
  async removeUser(id: number): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    await this.prisma.user.delete({ where: { id } });
    return true;
  }
  async promoteUser(id: number, value: boolean): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    await this.prisma.user.update({ where: { id }, data: { isAdmin: value } });
    return true;
  }
  async detachUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { employee: true } });
    if (!user || !user.employee?.id) return false;
    return await this.employeeService.remove(user.employee.id);
  }
  async attachUser(id: number, createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.employeeService.create(createEmployeeDto, id);
  }

  async findUserPermissions(userId: number): Promise<PermissionDetailDto[]> {
    const permissions = await this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
    return permissions.map(p => {
      return { id: p.id, type: p.type, permissionId: p.permission.id };
    });
  }
  async assignPermissionToUser(
    userId: number,
    permissionDetailDto: PermissionDetailDto,
  ): Promise<boolean> {
    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionDetailDto.permissionId },
    });
    if (!permission)
      throw new NotFoundException(
        `Permission with id ${permissionDetailDto.permissionId} not found`,
      );
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    const userP = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        permissionId: permissionDetailDto.permissionId,
        type: permissionDetailDto.type,
      },
    });
    if (userP) return false;
    await this.prisma.userPermission.create({
      data: {
        userId,
        permissionId: permissionDetailDto.permissionId,
        type: permissionDetailDto.type,
      },
    });
    return true;
  }
  async removePermission(permissionId: number): Promise<boolean> {
    const permission = await this.prisma.userPermission.findUnique({ where: { id: permissionId } });
    if (!permission) return false;
    await this.prisma.userPermission.delete({ where: { id: permissionId } });
    return true;
  }
  async setPermissions(userId: number, permissions: PermissionDetailDto[]): Promise<void> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    await this.prisma.userPermission.deleteMany({ where: { userId } });
    await this.prisma.userPermission.createMany({
      data: permissions.map(p => ({ userId, permissionId: p.permissionId, type: p.type })),
    });
  }
}
