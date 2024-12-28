export class IJwtPayload {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  refreshToken?: string;
}
