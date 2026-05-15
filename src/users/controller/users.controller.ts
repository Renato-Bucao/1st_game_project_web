import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; // ✅ import guard

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Protected route: GET /users/profile
  @UseGuards(AuthGuard('jwt')) // ✅ require JWT token
  @Get('profile')
  getProfile(@Request() req) {
    // req.user comes from JwtStrategy.validate()
    return req.user;
  }

  // GET /users → list all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // POST /users → create new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  // GET /users/:id → get single user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(Number(id));
  }

  // PUT /users/:id → update user
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(Number(id), updateUserDto);
  }

  // DELETE /users/:id → remove user
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
    return { message: `User with accountId ${id} removed successfully` };
  }
}
