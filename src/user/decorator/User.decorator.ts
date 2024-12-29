import { createParamDecorator, InternalServerErrorException } from '@nestjs/common';
import { IJwtPayload } from 'src/auth/interface/jwtPayload.interface';

export const User = createParamDecorator((key: keyof IJwtPayload, ctx) => {
  const user: IJwtPayload = ctx.switchToHttp().getRequest().user;
  if (!user)
    throw new InternalServerErrorException('GetUser decorator is invoked without authGuard');
  if (key && !user.hasOwnProperty(key))
    throw new InternalServerErrorException(`Unknown key ${key} in GetUser decorator`);
  return key ? user[key] : user;
});
