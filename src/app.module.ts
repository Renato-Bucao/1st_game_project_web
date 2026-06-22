import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';          // ✅ UsersModule → nag-handle sa user CRUD routes ug logic
import { TypeOrmModule } from '@nestjs/typeorm';             // ✅ TypeOrmModule → ORM para maka-connect sa MySQL database
import { ConfigModule } from '@nestjs/config';               // ✅ ConfigModule → para ma-load ang environment variables (.env)
import { AuthModule } from './auth/auth.module';             // ✅ AuthModule → nag-handle sa authentication (login, JWT, guards)
import { MailerModule } from '@nestjs-modules/mailer';       // ✅ MailerModule → para sa email sending
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@yourapp.com>',
      },
      template: {
        dir: join(process.cwd(), 'src/templates/mail'), // ✅ consistent path
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}