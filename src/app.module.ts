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
    // ✅ Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,                                               // → available sa tanan modules
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // → dynamic file depende sa NODE_ENV (development/production)
    }),

    // ✅ Database connection using env variables
    TypeOrmModule.forRoot({
      type: 'mysql',                                         // → gamit MySQL database
      host: process.env.DB_HOST,                             // → DB host gikan sa .env
      port: Number(process.env.DB_PORT),                     // → DB port (usually 3306)
      username: process.env.DB_USER,                         // → DB username
      password: process.env.DB_PASSWORD,                     // → DB password
      database: process.env.DB_NAME,                         // → DB name
      autoLoadEntities: true,                                // → auto-load ang mga @Entity classes
      synchronize: process.env.NODE_ENV === 'development',   // → auto-create tables only in dev mode
    }),

    // ✅ MailerModule config
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,        // e.g. smtp.gmail.com
        port: Number(process.env.MAIL_PORT),// e.g. 587
        secure: false,                      // true kung SSL (port 465)
        auth: {
          user: process.env.MAIL_USER,      // email account
          pass: process.env.MAIL_PASS,      // app password or SMTP password
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@yourapp.com>', // default sender
      },
      template: {
        dir: join(process.cwd(), 'src/templates'), // folder for .hbs files
        adapter: new HandlebarsAdapter(),  // ✅ correct adapter
        options: {
          strict: true,
        }
      } 
    }),

    UsersModule,                                             // ✅ Import UsersModule (user routes/services)
    AuthModule                                               // ✅ Import AuthModule (auth routes/services)
  ],
  controllers: [],                                           // ✅ Walay root controllers diri, modules na ang nagdala
  providers: [],                                             // ✅ Walay extra providers, modules na ang nagdala
})
export class AppModule {}                                    // ✅ Root module sa imong NestJS app
