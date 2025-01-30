import { createParamDecorator, InternalServerErrorException } from '@nestjs/common';
import { IJwtPayload } from 'src/auth/interface/jwtPayload.interface';
import { RequestWithUser } from 'src/auth/interface/RequestWithUser.interface';

export const User = createParamDecorator((key: keyof IJwtPayload, ctx) => {
  const req: RequestWithUser = ctx.switchToHttp().getRequest();
  const user = req.user;
  if (!user)
    throw new InternalServerErrorException('GetUser decorator is invoked without authGuard');
  if (key && !(key in user))
    throw new InternalServerErrorException(`Unknown key ${key} in GetUser decorator`);
  return key ? user[key] : user;
});
