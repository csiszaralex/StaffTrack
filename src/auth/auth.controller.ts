import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/user/decorator/User.decorator';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignInUserDto } from './dto/signInUser.dto';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';
import { IJwtPayload } from './interface/jwtPayload.interface';
import { ILoginPayload } from './interface/loginPayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() signInUserDto: SignInUserDto): Promise<ILoginPayload> {
    return this.authService.login(signInUserDto.email, signInUserDto.password);
  }

  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @User('id') userId: number,
    @User('refreshToken') rt: string,
  ): Promise<ILoginPayload> {
    return this.authService.refresh(userId, rt);
  }

  @Get('me')
  me(@User() user: IJwtPayload): IJwtPayload {
    return user;
  }
}
