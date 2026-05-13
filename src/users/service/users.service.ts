import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: { id: number; name: string }[] = [
    { id: 1, name: 'Renato' },
    { id: 2, name: 'Player1' },
  ];

  // READ all users
  findAll() {
    return this.users;
  }

  // READ one user by ID
  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  // CREATE new user
  create(name: string) {
    const newUser = { id: Date.now(), name };
    this.users.push(newUser);
    return newUser;
  }

  // UPDATE user by ID
  update(id: number, name: string) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.name = name;
      return user;
    }
    return null;
  }

  // DELETE user by ID
  remove(id: number) {
    this.users = this.users.filter(u => u.id !== id);
    return { deleted: true };
  }
}
