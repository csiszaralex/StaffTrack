import { Request } from 'express';
import { IJwtPayload } from './jwtPayload.interface';

export type RequestWithUser = Request & { user: IJwtPayload };
