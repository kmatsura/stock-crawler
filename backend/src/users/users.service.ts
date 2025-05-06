// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  /** メールアドレスで検索 */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findByEmail(email);
  }

  /** 全ユーザー取得 */
  async findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  /** 新規ユーザー作成（テスト用） */
  async create(email: string, plainPassword: string): Promise<User> {
    const uid = uuidv4();
    const pwdHash = await bcrypt.hash(plainPassword, 10);
    const user: User = { uid, email, pwdHash };
    await this.repo.save(user);
    return user;
  }
}
