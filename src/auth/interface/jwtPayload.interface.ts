import { Role } from '@prisma/client';

export class IJwtPayload {
  id: number;
  email: string;
  name: string;
  role: Role;
  refreshToken?: string;
}
