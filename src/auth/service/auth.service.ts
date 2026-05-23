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
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ❌ If banned → permanent until admin changes
    if (user.status === 'banned') {
      throw new UnauthorizedException('Your account has been permanently banned');
    }

    // ❌ If suspended → check duration
    if (user.status?.startsWith('suspended')) {
      // Example: status = "suspended:3days"
      const parts = user.status.split(':');
      if (parts.length === 2) {
        const duration = parts[1]; // "1day", "3days", "5days"
        const suspendedUntil = this.calculateSuspension(user.updatedDate, duration);
        if (new Date() < suspendedUntil) {
          throw new UnauthorizedException(`Your account is suspended until ${suspendedUntil.toISOString()}`);
        }
      }
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // ✅ Login and issue JWT
  async login(user: any, ipAddress: string) {
    // Auto update lastLogin + ipAddress
    await this.usersService.update(user.id, {
      lastLogin: new Date(),
      ipAddress,
    });

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
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

  await this.usersService.update(user.id, { resetToken });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await this.mailService.sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    template: 'forgot-password', // ✅ matches .hbs filename
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

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, { password: hashedPassword });

    return { message: 'Password successfully reset' };
  } catch (err) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

}
