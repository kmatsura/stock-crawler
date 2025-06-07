import { CrawlerService } from '../crawler/crawler.service';
import { IPriceSource } from '../price-sources/IPriceSource';
import { PriceRepository } from '../infra/repositories/price.repository';

describe('CrawlerService', () => {
  it('falls back to RapidAPI when Yahoo fails', async () => {
    const yahooGetClose = jest.fn().mockRejectedValue(new Error('fail'));
    const rapidGetClose = jest.fn().mockResolvedValue(2915);
    const yahoo: IPriceSource = {
      name: 'yahoo',
      getClose: yahooGetClose,
    };
    const rapid: IPriceSource = {
      name: 'rapid',
      getClose: rapidGetClose,
    };
    const repo: Partial<PriceRepository> = { put: jest.fn() };
    const svc = new CrawlerService([yahoo, rapid], repo as PriceRepository);
    const date = new Date('2023-01-01T00:00:00Z');
    await svc.fetchAndSave(7203, date);
    expect(yahooGetClose).toHaveBeenCalled();
    expect(rapidGetClose).toHaveBeenCalled();
    expect(repo.put).toHaveBeenCalledWith(
      expect.objectContaining({ price: 2915 }),
    );
  });
});
