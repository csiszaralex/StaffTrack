import { createParamDecorator } from '@nestjs/common';
import { IJwtPayload } from 'src/auth/interface/jwtPayload.interface';

export const GetUserId = createParamDecorator((_, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const user: IJwtPayload = req.user;
  return user.id;
});
