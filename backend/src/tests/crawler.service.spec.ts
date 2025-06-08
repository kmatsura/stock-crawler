import { CrawlerService } from '../crawler/crawler.service';
import { IPriceSource } from '../price-sources/IPriceSource';
import { PriceRepository } from '../infra/repositories/price.repository';

describe('CrawlerService', () => {
  it('saves the price from the source', async () => {
    const yahooGetClose = jest.fn().mockResolvedValue(2915);
    const yahoo: IPriceSource = {
      name: 'yahoo',
      getClose: yahooGetClose,
    };
    const repo: Partial<PriceRepository> = { put: jest.fn() };
    const svc = new CrawlerService([yahoo], repo as PriceRepository);
    const date = new Date('2023-01-01T00:00:00Z');
    await svc.fetchAndSave(7203, date);
    expect(yahooGetClose).toHaveBeenCalled();
    expect(repo.put).toHaveBeenCalledWith(
      expect.objectContaining({ price: 2915 }),
    );
  });
});
