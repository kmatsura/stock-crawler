// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** LocalStrategy から呼ばれる */
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.pwdHash))) {
      const { uid, email: userEmail } = user;
      return { uid, email: userEmail };
    }
    return null;
  }

  /** /auth/login で呼ばれる */
  login(user: { uid: string; email: string }) {
    const payload = { sub: user.uid, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
