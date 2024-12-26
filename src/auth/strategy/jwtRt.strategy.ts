import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppConfig } from 'src/config/app.config.interface';
import { UserService } from 'src/user/user.service';
import { IJwtPayload } from '../interface/jwtPayload.interface';

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.refreshToken.secret'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: IJwtPayload) {
    const refreshToken = req.get('Authorization')!.replace('Bearer ', '').trim();
    return { refreshToken, ...payload };
  }
}
