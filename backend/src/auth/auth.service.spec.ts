import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('dummy-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('正しい資格情報ならユーザー情報を返す', async () => {
      const plain = 'password';
      const hash = await bcrypt.hash(plain, 10);
      (usersService.findByEmail! as jest.Mock).mockResolvedValue({
        uid: 'u1',
        email: 'e@e.com',
        pwdHash: hash,
      });

      await expect(service.validateUser('e@e.com', plain)).resolves.toEqual({
        uid: 'u1',
        email: 'e@e.com',
      });
    });

    it('ユーザー不存在なら null を返す', async () => {
      (usersService.findByEmail! as jest.Mock).mockResolvedValue(undefined);
      await expect(service.validateUser('x@x.com', 'pass')).resolves.toBeNull();
    });

    it('パスワード不一致なら null を返す', async () => {
      const hash = await bcrypt.hash('other', 10);
      (usersService.findByEmail! as jest.Mock).mockResolvedValue({
        uid: 'u2',
        email: 'e2@e.com',
        pwdHash: hash,
      });
      await expect(
        service.validateUser('e2@e.com', 'wrong'),
      ).resolves.toBeNull();
    });
  });

  describe('login', () => {
    it('JWT を発行して返す', () => {
      const user = { uid: 'u3', email: 'e3@e.com' };
      // login は現状同期メソッドなので resolves は不要
      expect(service.login(user)).toEqual({ access_token: 'dummy-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.uid,
        email: user.email,
      });
    });
  });
});
