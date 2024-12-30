import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/createEmpleyee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto, userId: number): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        phone: createEmployeeDto.phone,
        fullName: createEmployeeDto.fullName,
        motherName: createEmployeeDto.motherName,
        birthName: createEmployeeDto.birthName,
        birthDate: createEmployeeDto.birthDate,
        placeOfBirth: createEmployeeDto.placeOfBirth,
        nationality: createEmployeeDto.nationality,
        sex: createEmployeeDto.sex,
        taxId: createEmployeeDto.taxId,
        TAJ: createEmployeeDto.TAJ,
        Address: createEmployeeDto.Address,
        userId: userId,
      },
    });
  }
  async remove(id: number): Promise<boolean> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) return false;
    await this.prisma.employee.delete({ where: { id } });
    return true;
  }
}
