import { Module } from '@nestjs/common';
import { EmployeeModule } from 'src/employee/employee.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [EmployeeModule],
})
export class UserModule {}
