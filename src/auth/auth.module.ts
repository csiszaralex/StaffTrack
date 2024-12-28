import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRtStrategy } from './strategy/jwtRt.strategy';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRtStrategy, CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class AuthModule {}
