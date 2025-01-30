import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { AppConfig } from 'src/config/app.config.interface';
import { UserService } from 'src/user/user.service';
import { IJwtPayload } from './interface/jwtPayload.interface';
import { ILoginPayload } from './interface/loginPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<ILoginPayload> {
    const user = await this.validateUser(email, password);
    return this.generateToken(user);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const passwd = /^\$2b\$10\$/.test(password) ? password : await hash(password, user.salt);
    if (!(passwd === user.password)) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
  generateToken(user: User): ILoginPayload {
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwt.accessToken.secret'),
      expiresIn: this.configService.get<string>('auth.jwt.accessToken.expiresIn'),
    });
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('auth.jwt.refreshToken.secret'),
        expiresIn: this.configService.get<string>('auth.jwt.refreshToken.expiresIn'),
      },
    );
    return { accessToken, refreshToken };
  }
  async refresh(userId: number, refreshToken: string): Promise<ILoginPayload> {
    //TODO: Implement refresh token save for better security
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.generateToken(user);
  }
}
