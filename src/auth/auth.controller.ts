import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/user/decorator/getUser.decorator';
import { GetUserId } from 'src/user/decorator/getUserId.decorator';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { SignInUserDto } from './dto/signInUser.dto';
import { JwtRefreshGuard } from './guard/jwtRefresh.guard';
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
  async refresh(@GetUserId() userId: number, @GetUser('refreshToken') rt: string) {
    return this.authService.refresh(userId, rt);
  }

  @Get('me')
  async me(@GetUser() user: any) {
    return user;
  }
}
