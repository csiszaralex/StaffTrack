import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
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
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token: unknown = req?.cookies?.refreshToken;
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.refreshToken.secret')!,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: IJwtPayload) {
    const cookies = (req as Request & { cookies?: { [key: string]: any } }).cookies;
    const refreshToken =
      typeof cookies?.refreshToken === 'string' ? cookies.refreshToken : undefined;
    return { refreshToken, ...payload };
  }
}
