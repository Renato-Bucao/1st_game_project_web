import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'; // ✅ NestJS core decorators ug exceptions
import { InjectRepository } from '@nestjs/typeorm'; // ✅ Para ma-inject ang TypeORM repository
import { Repository } from 'typeorm';               // ✅ TypeORM repository class
import { User } from '../entities/user';            // ✅ User entity nga naka-map sa DB table
import { CreateUserDto } from '../dto/create-user.dto'; // ✅ DTO para sa create user request
import { UpdateUserDto } from '../dto/update-user.dto'; // ✅ DTO para sa update user request
import * as bcrypt from 'bcrypt';                   // ✅ Library para sa password hashing

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ✅ Marks this class as injectable (pwede i‑inject sa controller/service)
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)                         // ✅ Inject User repository gikan sa TypeORM
    private usersRepository: Repository<User>,      // ✅ Repository object para maka-access sa DB operations
  ) { }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // READ all users
  async findAll() {
    return await this.usersRepository.find();       // ✅ Query tanan users gikan sa DB
  }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // READ one user by ID
  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } }); // ✅ Query user by ID

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // ❌ Throw error kung wala makita
    }
    return user;                                    // ✅ Return user object kung makita
  }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Find one user by email
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // READ one user by username
  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } }); // ✅ Query user by username

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`); // ❌ Throw error kung wala makita
    }
    return user;                                    // ✅ Return user object kung makita
  }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // CREATE new user
async create(createUserDto: CreateUserDto) {
  const { username, email, password, ipAddress } = createUserDto;

  // ✅ Input validation
  if (!username || username.trim() === '')
    throw new BadRequestException('Username should not be empty');
  if (!password || password.trim() === '')
    throw new BadRequestException('Password should not be empty');
  if (!email || email.trim() === '')
    throw new BadRequestException('Email should not be empty');

    // ✅ Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

   // ✅ Create new user entity
  const user = this.usersRepository.create({
    username,
    email,
    password: hashedPassword, // store hashed password only
    status: 'active',         // default
    role: 'user',           // default
    createdDate: new Date(),
    ipAddress,                // ✅ automatic log sa IP
    });

    return await this.usersRepository.save(user);  // ✅ Save user to DB
  }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // UPDATE user by ID
  async update(id: number, updateData: UpdateUserDto, currentUser?: any) {
  // ✅ Kung naa ang currentUser (gikan sa token), i‑check nga match ang id
  if (currentUser && currentUser.userId !== id) {
    throw new ForbiddenException('You can only update your own account');
  }

  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // ✅ Apply updates
  if (updateData.username) user.username = updateData.username;
  if (updateData.email) user.email = updateData.email;
  if (updateData.password) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(updateData.password, saltRounds);
    } 
  
  // ✅ Same update logic as before
  if (updateData.username !== undefined) {
    if (updateData.username.trim() === '') throw new BadRequestException('Username should not be empty');
    user.username = updateData.username;
  }

  if (updateData.password !== undefined) {
    if (updateData.password.trim() === '') throw new BadRequestException('Password should not be empty');
    const saltRounds = 10;
    user.password = await bcrypt.hash(updateData.password, saltRounds);
  }

  if (updateData.email !== undefined) {
    if (updateData.email.trim() === '') throw new BadRequestException('Email should not be empty');
    user.email = updateData.email;
  }

  if (updateData.status !== undefined) user.status = updateData.status;
  if (updateData.role !== undefined) user.role = updateData.role;

  return await this.usersRepository.save(user);
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // DELETE user by ID
  async remove(id: number) {
    const result = await this.usersRepository.delete({ id: id }); // ✅ Delete user by ID

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`); // ❌ Throw error kung wala na-delete
    }

    return { message: `User with ID ${id} deleted successfully` }; // ✅ Return success message
  }
}
