import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TestingModule, Test } from '@nestjs/testing';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Partial<UsersRepository>;

  beforeEach(async () => {
    repo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: UsersRepository, useValue: repo }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('findByEmail はリポジトリを呼び出す', async () => {
    const user = { uid: '1', email: 'a@b.com', pwdHash: 'h' };
    (repo.findByEmail! as jest.Mock).mockResolvedValue(user);

    await expect(service.findByEmail('a@b.com')).resolves.toBe(user);
    expect(repo.findByEmail).toHaveBeenCalledWith('a@b.com');
  });

  it('create はユーザーを生成しリポジトリに保存する', async () => {
    (repo.save! as jest.Mock).mockResolvedValue(undefined);

    const email = 'x@y.com';
    const plainPassword = 'pass123';
    const user = await service.create(email, plainPassword);

    expect(user.uid).toBeDefined();
    expect(user.email).toBe(email);
    expect(typeof user.pwdHash).toBe('string');
    expect(user.pwdHash.length).toBeGreaterThan(20);
    expect(repo.save).toHaveBeenCalledWith(user);
  });
});
