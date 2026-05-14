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
    return await this.usersService.create(createUserDto);
  }

  // ✅ Get single user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(Number(id));
  }

  // ✅ Update user with DTO validation
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // FIX: pass the whole DTO, not just name
    return await this.usersService.update(Number(id), updateUserDto);
  }

  // ✅ Delete user
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
    return { message: `User with accountId ${id} removed successfully` };
  }
}
