import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/decorator/User.decorator';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignInUserDto } from './dto/signInUser.dto';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';
import { IJwtPayload } from './interface/jwtPayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() signInUserDto: SignInUserDto,
    @Res() res: Response,
  ): Promise<Response<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.authService.login(
      signInUserDto.email,
      signInUserDto.password,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    return res.send({ accessToken });
  }

  @Post('refresh')
  @Public()
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @User('id') userId: number,
    @User('refreshToken') rt: string,
    @Res() res: Response,
  ): Promise<Response<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.authService.refresh(userId, rt);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === 'production',
    });
    return res.send({ accessToken });
  }
  //TODO: Implement logout functionality which clears the refresh token cookie

  @Get('me')
  me(@User() user: IJwtPayload): IJwtPayload {
    return user;
  }
}
