import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // READ all users
  findAll() {
    return this.usersRepository.find();
  }

  // READ one user by ID
  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  // CREATE new user
  create(name: string) {
    const newUser = this.usersRepository.create({ name });
    return this.usersRepository.save(newUser);
  }

  // UPDATE user by ID
update(id: number, name?: string) {
  if (name) {
    return this.usersRepository.update(id, { name });
  }
  return { message: 'No fields to update' };
}

  // DELETE user by ID
  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
