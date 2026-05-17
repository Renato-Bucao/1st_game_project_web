import { Controller, Post, Body, Req, Ip } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Ip() ip: string, // ✅ always string
  ) {
    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user, ip);
  }
}