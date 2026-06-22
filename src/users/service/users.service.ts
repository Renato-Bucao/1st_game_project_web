import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // READ all users (hide password)
  async findAll() {
    return await this.usersRepository.find({
      select: [
        'id','username','email','status','role',
        'lastLogin','ipAddress','resetToken',
        'createdDate','updatedDate',
      ],
    });
  }

  // READ one user by ID
// READ one user by ID (hide password)
async findOne(id: number) {
  const user = await this.usersRepository.findOne({
    where: { id },
    select: [
      'id',
      'username',
      'email',
      'status',
      'role',
      'lastLogin',
      'ipAddress',
      'resetToken',
      'createdDate',
      'updatedDate',
    ], // ✅ password excluded
  });

  if (!user) throw new NotFoundException(`User with ID ${id} not found`);
  return user;
  }

  // 🔍 Find user by email (needed in forgotPassword)
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id','username','email','password','status','role','updatedDate','resetToken'],
    });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  // 🔍 Find user by username (needed in login)
  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['id','username','email','password','status','role','updatedDate'],
    });
    if (!user) throw new NotFoundException(`User with username ${username} not found`);
    return user;
  }

  // CREATE new user
  async create(createUserDto: CreateUserDto) {
    const { username, email, password, ipAddress } = createUserDto;

    if (await this.usersRepository.findOne({ where: { username } })) {
      throw new BadRequestException(`Username "${username}" is already taken`);
    }
    if (await this.usersRepository.findOne({ where: { email } })) {
      throw new BadRequestException(`Email "${email}" is already registered`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
    username: createUserDto.username,
    email: createUserDto.email,
    password: hashedPassword,
    ipAddress,
    status: 'pending',
    role: 'user',
    });

    const savedUser = await this.usersRepository.save(user);
    return { message: 'User created successfully', data: savedUser };
  }

  // UPDATE user by ID
  async update(id: number, updateData: UpdateUserDto, currentUser?: any) {
  if (currentUser && currentUser.userId !== id) {
    throw new ForbiddenException('You can only update your own account');
  }

  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found`);

  Object.assign(user, updateData);

  // ✅ Hashing handled consistently here
  if (updateData.password) {
    user.password = await bcrypt.hash(updateData.password, 10);
  }

  const savedUser = await this.usersRepository.save(user);
  return { message: 'User updated successfully', data: savedUser };
}


  // DELETE user by ID
  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.usersRepository.delete({ id });
    return { message: `User with ID ${id} deleted successfully`, data: user };
  }

// ✅ Helper: set reset token (used in forgotPassword)
async setResetToken(id: number, resetToken: string) {
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found`);

  user.resetToken = resetToken;
  const savedUser = await this.usersRepository.save(user);
  return { message: 'Reset token updated', data: savedUser };
}

}
