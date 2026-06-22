import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  // ✅ Validate user credentials (supports username OR email)
  async validateUser(identifier: string, pass: string) {
    let user = await this.usersService.findOneByUsername(identifier).catch(() => null);
    if (!user) {
      user = await this.usersService.findOneByEmail(identifier).catch(() => null);
    }
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status === 'banned') {
      throw new UnauthorizedException('Your account has been permanently banned');
    }

    if (user.status?.startsWith('suspended')) {
      const parts = user.status.split(':');
      if (parts.length === 2) {
        const duration = parts[1];
        const suspendedUntil = this.calculateSuspension(user.updatedDate, duration);
        if (new Date() < suspendedUntil) {
          throw new UnauthorizedException(
            `Your account is suspended until ${suspendedUntil.toISOString()}`,
          );
        }
      }
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account not active. Please verify your email.');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // ✅ Verify email
  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findOne(payload.sub);
      if (!user) throw new NotFoundException('User not found');

      if (user.verificationToken !== token) {
        throw new UnauthorizedException('Invalid verification token');
      }

      user.status = 'active';
      user.verificationToken = undefined;
      await this.usersService.update(user.id, user);

      return { message: 'Email successfully verified' };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // ✅ Resend verification
  async resendVerification(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || user.status === 'active') {
      throw new BadRequestException('User already verified or not found');
    }

    const payload = { sub: user.id, email: user.email };
    const newToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    await this.usersService.update(user.id, { verificationToken: newToken });

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Resend: Verify your email',
      template: 'verify-email',
      context: {
        username: user.username,
        verifyLink: `${process.env.FRONTEND_URL}/verify-email?token=${newToken}`,
      },
    });

    return { message: 'Verification email resent successfully' };
  }

  // ✅ Login and issue JWT
  async login(user: any, ipAddress: string) {
    const updated = await this.usersService.update(user.id, {
      lastLogin: new Date(),
      ipAddress,
    });

    const payload = { username: updated.data.username, sub: updated.data.id, role: updated.data.role };
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

  // ✅ Forgot password
  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const payload = { sub: user.id, email: user.email };
    const resetToken = this.jwtService.sign(payload, { expiresIn: '15m' });

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

  // ✅ Reset password (hash properly)
  async resetPassword(token: string, newPassword: string) {
  try {
    const payload = this.jwtService.verify(token);
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new NotFoundException('User not found');

    // ❌ Do not hash here – let UsersService.update handle hashing
    await this.usersService.update(user.id, { password: newPassword });

    return { message: 'Password successfully reset' };
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
}
