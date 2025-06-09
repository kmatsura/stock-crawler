import { Test, TestingModule } from '@nestjs/testing';
import { WatchService } from './watch.service';
import { WatchRepository } from './watch.repository';
import { PriceRepository } from '../infra/repositories/price.repository';
import { CrawlerService } from '../crawler/crawler.service';

describe('WatchService', () => {
  let service: WatchService;
  let repo: Partial<WatchRepository>;
  let priceRepo: Partial<PriceRepository>;
  let crawler: Partial<CrawlerService>;

  beforeEach(async () => {
    repo = {
      findAll: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    priceRepo = {
      findLatestPriceByCode: jest.fn(),
    };
    crawler = {
      fetchAndSave: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchService,
        { provide: WatchRepository, useValue: repo },
        { provide: PriceRepository, useValue: priceRepo },
        { provide: CrawlerService, useValue: crawler },
      ],
    }).compile();

    service = module.get<WatchService>(WatchService);
  });

  it('findAll merges latest price', async () => {
    (repo.findAll as jest.Mock).mockResolvedValue([
      { uid: 'u1', code: '7203', createdAt: 'd' },
    ]);
    (priceRepo.findLatestPriceByCode as jest.Mock).mockResolvedValue({
      price: 1000,
      tsISO: 'd2',
    });
    await expect(service.findAll('u1')).resolves.toEqual([
      {
        uid: 'u1',
        code: '7203',
        createdAt: 'd',
        latestPrice: 1000,
        yieldPercent: 0,
      },
    ]);
    expect(repo.findAll).toHaveBeenCalledWith('u1');
    expect(priceRepo.findLatestPriceByCode).toHaveBeenCalledWith(7203);
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

  it('refreshPrices fetches prices and returns updated list', async () => {
    (repo.findAll as jest.Mock).mockResolvedValue([
      { uid: 'u1', code: '7203', createdAt: 'd' },
    ]);
    (priceRepo.findLatestPriceByCode as jest.Mock).mockResolvedValue({
      price: 1200,
      tsISO: 'd2',
    });
    await expect(service.refreshPrices('u1')).resolves.toEqual([
      {
        uid: 'u1',
        code: '7203',
        createdAt: 'd',
        latestPrice: 1200,
        yieldPercent: 0,
      },
    ]);
    expect(crawler.fetchAndSave).toHaveBeenCalledWith(7203);
  });
});
