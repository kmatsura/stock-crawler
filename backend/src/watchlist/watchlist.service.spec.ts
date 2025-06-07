import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';

describe('WatchlistService', () => {
  let service: WatchlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchlistService],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
  });

  it('create and findAll should store watches', async () => {
    const watch = await service.create('u1', '7203');
    expect(watch.uid).toBe('u1');
    expect(watch.code).toBe('7203');
    expect(typeof watch.createdAt).toBe('string');

    const list = await service.findAll('u1');
    expect(list).toHaveLength(1);
    expect(list[0].code).toBe('7203');
  });

  it('remove should delete watch', async () => {
    await service.create('u1', '7203');
    await service.create('u1', '1111');
    await service.remove('u1', '7203');
    const list = await service.findAll('u1');
    expect(list.map((w) => w.code)).toEqual(['1111']);
  });
});
