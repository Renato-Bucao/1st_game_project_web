import { Controller, Post, Body, Req, Ip, Get, Query, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../service/auth.service';
import { UsersService } from 'src/users/service/users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';              // ✅ correct import
import { MailerService } from '@nestjs-modules/mailer'; // ✅ correct import

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,          // ✅ injected properly
    private readonly mailService: MailerService,      // ✅ injected properly
  ) {}

  @Post('register')
async register(@Body() createUserDto: CreateUserDto, @Req() req: any) {
  // ❌ Do not hash here – UsersService.create handles hashing
  const newUserResponse = await this.usersService.create({
    ...createUserDto,
    status: 'pending',
    ipAddress: req.ip,
  });

  const newUser = newUserResponse.data;

  // ✅ Generate verification token
  const payload = { sub: newUser.id, email: newUser.email };
  const verificationToken = this.jwtService.sign(payload, { expiresIn: '1h' });

  // ✅ Save token in DB
  await this.usersService.update(newUser.id, { verificationToken });

  // ✅ Send verification email
  await this.mailService.sendMail({
    to: newUser.email,
    subject: 'Verify your email',
    template: 'verify-email',
    context: {
      username: newUser.username,
      verifyLink: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
    },
  });

  return { message: 'Registration successful. Please check your email to verify your account.' };
}



 @Get('verify-email')
async verifyEmail(@Query('token') token: string) {
  try {
    const payload = this.jwtService.verify(token);
    await this.usersService.update(payload.sub, {
      status: 'active',
      verificationToken: undefined, // ✅ clear token after verification
    });
    return { message: 'Email verified successfully' };
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

  
  @Post('resend-verification')
async resendVerification(@Body('email') email: string) {
  return this.authService.resendVerification(email);
}


@Public()
@Post('login')
async login(
  @Body() body: { identifier: string; password: string }, // ✅ flexible: username OR email
  @Ip() ip: string,
) {
  const user = await this.authService.validateUser(body.identifier, body.password);
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
