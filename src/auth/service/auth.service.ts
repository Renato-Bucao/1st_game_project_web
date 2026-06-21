import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/service/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  // ✅ Validate user credentials
  async validateUser(username: string, pass: string) {
  const user = await this.usersService.findOneByUsername(username);

  if (user.status === 'banned') {
    throw new UnauthorizedException('Your account has been permanently banned');
  }

  if (user.status?.startsWith('suspended')) {
    const parts = user.status.split(':');
    if (parts.length === 2) {
      const duration = parts[1];
      const suspendedUntil = this.calculateSuspension(user.updatedDate, duration);
      if (new Date() < suspendedUntil) {
        throw new UnauthorizedException(`Your account is suspended until ${suspendedUntil.toISOString()}`);
      }
    }
  }

  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  return user;
}


  // ✅ Login and issue JWT
async login(user: any, ipAddress: string) {
  const { data } = await this.usersService.update(user.id, {
    lastLogin: new Date(),
    ipAddress,
  });

  const payload = { username: data.username, sub: data.id, role: data.role };
  return { access_token: this.jwtService.sign(payload) };
}


  // ✅ Helper: calculate suspension end date
  private calculateSuspension(startDate: Date, duration: string): Date {
    const suspendedUntil = new Date(startDate);
    switch (duration) {
      case '1day':
        suspendedUntil.setDate(suspendedUntil.getDate() + 1);
        break;
      case '3days':
        suspendedUntil.setDate(suspendedUntil.getDate() + 3);
        break;
      case '5days':
        suspendedUntil.setDate(suspendedUntil.getDate() + 5);
        break;
    }
    return suspendedUntil;
  }

async forgotPassword(email: string) {
  const user = await this.usersService.findOneByEmail(email);
  if (!user) throw new NotFoundException('User not found');

  const payload = { sub: user.id, email: user.email };
  const resetToken = this.jwtService.sign(payload, { expiresIn: '15m' });

  // ✅ Use UsersService helper
  await this.usersService.setResetToken(user.id, resetToken);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await this.mailService.sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'forgot-password',
    context: {
      username: user.username,
      resetLink,
    },
  });

  return { message: 'Password reset link sent to your email' };
}


async resetPassword(token: string, newPassword: string) {
  try {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new NotFoundException('User not found');

    // ❌ Dili na nato i‑hash diri
    await this.usersService.update(user.id, { password: newPassword });

    return { message: 'Password successfully reset' };
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
}


}
