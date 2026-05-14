import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

// ✅ Marks this class as injectable (pwede i‑inject sa controller/service)
@Injectable()
export class UsersService {
  constructor(
    // ✅ Injects the User repository (TypeORM) so we can access DB operations
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // READ all users
  async findAll() {
    return await this.usersRepository.find();
  }

  // READ one user by ID
  async findOne(id: number) {
    // ✅ Find user by ID (await waits for DB query result)
    const user = await this.usersRepository.findOne({ where: { accountId:id } });

    // ❌ If no user found, throw NotFoundException
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // ✅ Return found user
    return user;
  }

  // CREATE new user
  // ✅ Async function because DB operations are asynchronous (return Promises)
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.username || createUserDto.username.trim() === '') {                                // ✅ Check if name is empty or only spaces                    
      throw new BadRequestException('Name should not be empty');                                // ❌ Throw error if invalid input
    }
    const user = this.usersRepository.create(createUserDto);               // ✅ Create a new User entity instance (not yet saved to DB)
    return await this.usersRepository.save(user);                                                // ✅ Save user to DB (await ensures we wait until DB operation finishes)
  }

  // UPDATE user by ID
 async update(id: number, updateData: UpdateUserDto) {
  const user = await this.usersRepository.findOne({ where: { accountId: id } });
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  // ✅ Validate username if provided
  if (updateData.username !== undefined) {
    if (updateData.username.trim() === '') {
      throw new BadRequestException('Username should not be empty');
    }
    user.username = updateData.username;
  }

  // ✅ Merge other fields
  Object.assign(user, updateData);

  return await this.usersRepository.save(user);
}

  // DELETE user by ID
  async remove(id: number) {
    // ✅ Delete user by ID
    const result = await this.usersRepository.delete({ accountId: id });

    // ❌ If no rows affected, user not found
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // ✅ Return success message
    return { message: `User with ID ${id} deleted successfully` };
  }
}
