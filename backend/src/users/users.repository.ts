import { Injectable } from '@nestjs/common';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  private users = new Map<string, User>();

  findByEmail(email: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    return Promise.resolve(user);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(Array.from(this.users.values()));
  }

  save(user: User): Promise<void> {
    this.users.set(user.uid, user);
    return Promise.resolve();
  }
}
