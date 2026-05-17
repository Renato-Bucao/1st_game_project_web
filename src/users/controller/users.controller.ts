import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Patch } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; // ✅ import guard
import { Public } from 'src/common/decorators/public.decorator';

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
  @Public() // ✅ mark this route as public (no auth required)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  // GET /users/:id → get single user
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(Number(id));
  }

  // PUT → full update (replace all fields)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
    // PATCH → partial update (only specific fields)
  @Patch(':id')
  async patchUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /users/:id → remove user
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
    return { message: `User with accountId ${id} removed successfully` };
  }
}
