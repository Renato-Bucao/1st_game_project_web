import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ Create user with DTO validation
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // DTO ensures input is valid (ValidationPipe handles this globally)
    return await this.usersService.create(createUserDto.name);
  }

  // ✅ Get single user with error handling
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Service throws NotFoundException if user doesn’t exist
    return await this.usersService.findOne(Number(id));
  }

  // ✅ Update user with DTO validation + error handling
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // DTO ensures input is valid, service handles errors
    return await this.usersService.update(Number(id), updateUserDto.name);
  }

  // ✅ Delete user with error handling
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Service throws NotFoundException if user doesn’t exist
    return await this.usersService.remove(Number(id));
  }
}