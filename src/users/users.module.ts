import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller'; // gikan sa controller folder
import { UsersService } from './service/users.service';         // gikan sa service folder

@Module({
  controllers: [UsersController], // register controller
  providers: [UsersService],      // register service
})
export class UsersModule {}
