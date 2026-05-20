import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Patch, Req } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport'; // ✅ import guard
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/gaurds/jwt-auth.guard'; // ✅ import JWT auth guard
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Protected route: GET /users/profile
  @Get('profile')
  @Roles('user') // normal users only
  getProfile() {
    return 'User profile';
  }

  // GET /users → list all users
  @Get('all')
  @Roles('moderator') // moderators only
  findAll() {
    return 'List of users';
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
  @UseGuards(JwtAuthGuard) // ✅ Require JWT token
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any, // ✅ req.user gikan sa JwtStrategy.validate()
  ) {
    return this.usersService.update(Number(id), updateUserDto, req.user);
  }
    // PATCH → partial update (only specific fields)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    return this.usersService.update(Number(id), updateUserDto, req.user);
  }

  // DELETE /users/:id → remove user
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(Number(id));
    return { message: `User with accountId ${id} removed successfully` };
  }
}
