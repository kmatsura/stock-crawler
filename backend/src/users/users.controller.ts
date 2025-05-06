// src/users/users.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export default class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  async create(@Body() body: { email: string; password: string }) {
    const user = await this.users.create(body.email, body.password);
    return { uid: user.uid, email: user.email };
  }

  @Get()
  async findAll() {
    const users = await this.users.findAll();
    // UID と email のみ返却
    return users.map((u) => ({ uid: u.uid, email: u.email }));
  }
}
