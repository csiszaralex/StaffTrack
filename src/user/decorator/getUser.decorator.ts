import { createParamDecorator } from '@nestjs/common';
import { IJwtPayload } from 'src/auth/interface/jwtPayload.interface';

export const GetUser = createParamDecorator((data: keyof IJwtPayload, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const user: IJwtPayload = req.user;
  return data ? user?.[data] : user;
});
