import { Test, TestingModule } from '@nestjs/testing';
import { WatchService } from './watch.service';
import { WatchRepository } from './watch.repository';

describe('WatchService', () => {
  let service: WatchService;
  let repo: Partial<WatchRepository>;

  beforeEach(async () => {
    repo = {
      findAll: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchService, { provide: WatchRepository, useValue: repo }],
    }).compile();

    service = module.get<WatchService>(WatchService);
  });

  it('findAll delegates to repository', async () => {
    (repo.findAll as jest.Mock).mockResolvedValue(['x']);
    await expect(service.findAll('u1')).resolves.toEqual(['x']);
    expect(repo.findAll).toHaveBeenCalledWith('u1');
  });

  it('create builds watch and saves', async () => {
    (repo.save as jest.Mock).mockResolvedValue(undefined);
    const watch = await service.create('u2', '7203');
    expect(watch.uid).toBe('u2');
    expect(watch.code).toBe('7203');
    expect(typeof watch.createdAt).toBe('string');
    expect(repo.save).toHaveBeenCalledWith(watch);
  });

  it('remove delegates to repository', async () => {
    (repo.remove as jest.Mock).mockResolvedValue(undefined);
    await expect(service.remove('u1', '7203')).resolves.toBeUndefined();
    expect(repo.remove).toHaveBeenCalledWith('u1', '7203');
  });
});
