import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | Record<string, string> | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();
    return data
      ? (request.cookies?.[data] as string | undefined)
      : (request.cookies as Record<string, string> | undefined);
  },
);
