import { OmitType } from '@nestjs/swagger';
import { EmployeeEntity } from './employee.entity';

export class CreateEmployeeDto extends OmitType(EmployeeEntity, ['user']) {}
