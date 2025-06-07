import { config } from 'dotenv';
config();

import { CrawlerService } from './crawler.service';
import { YahooSource } from '../price-sources/yahoo.source';
import { RapidAPISource } from '../price-sources/rapidapi.source';
import { PriceRepository } from '../infra/repositories/price.repository';

const code = Number(process.argv[2]);
if (!code) {
  throw new Error('Usage: npm run crawl <TSE_CODE>');
}

const crawler = new CrawlerService(
  [new YahooSource(), new RapidAPISource()],
  new PriceRepository(),
);

void crawler.fetchAndSave(code).then(() => {
  console.log('Done');
  process.exit(0);
});
