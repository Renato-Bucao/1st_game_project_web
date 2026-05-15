import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ✅ ensure ConfigModule is imported
      inject: [ConfigService], // ✅ inject ConfigService
       useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: Number(configService.get('JWT_EXPIRES_IN') || 3600) }, // (3600 = 1 hour).
    };
  },
}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
