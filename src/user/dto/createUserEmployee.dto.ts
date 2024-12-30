import { IntersectionType } from '@nestjs/swagger';
import { CreateEmployeeDto } from 'src/employee/dto/createEmpleyee.dto';
import { CreateUserDto } from './createUser.dto';

export class CreateUserEmployeeDto extends IntersectionType(CreateUserDto, CreateEmployeeDto) {}
