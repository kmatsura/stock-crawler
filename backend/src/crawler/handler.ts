import { CrawlerService } from './crawler.service';
import { YahooSource } from '../price-sources/yahoo.source';
import { PriceRepository } from '../infra/repositories/price.repository';

export const main = async (event: { code: number }) => {
  const crawler = new CrawlerService(
    [new YahooSource()],
    new PriceRepository(),
  );
  await crawler.fetchAndSave(event.code);
  return { ok: true };
};
