import { Controller, Post, Body, Req, Ip } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { UsersService } from 'src/users/service/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    // ✅ kuha ang IP address gikan sa request
    const ipAddress = req.ip;

    // ✅ pass ipAddress sa service
    return this.usersService.create({ ...createUserDto, ipAddress })
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Ip() ip: string, // ✅ always string
  ) {
    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user, ip);
  }

  @Post('forgot-password')
async forgotPassword(@Body('email') email: string) {
  return this.authService.forgotPassword(email);
}

@Post('reset-password')
async resetPassword(@Body() body: { token: string; newPassword: string }) {
  return this.authService.resetPassword(body.token, body.newPassword);
  }

  
}