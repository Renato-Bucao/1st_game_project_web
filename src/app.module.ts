import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'testing',
    password: 'sia|av@JV4',
    database: 'testing',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), 
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
