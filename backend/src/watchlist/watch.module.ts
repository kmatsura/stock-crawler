import { Module } from '@nestjs/common';
import { WatchService } from './watch.service';
import { WatchRepository } from './watch.repository';
import { WatchController } from './watch.controller';
import { PriceRepository } from '../infra/repositories/price.repository';
import { CrawlerService } from '../crawler/crawler.service';
import { YahooSource } from '../price-sources/yahoo.source';

@Module({
  providers: [
    WatchService,
    WatchRepository,
    PriceRepository,
    {
      provide: CrawlerService,
      useFactory: (repo: PriceRepository) =>
        new CrawlerService([new YahooSource()], repo),
      inject: [PriceRepository],
    },
  ],
  controllers: [WatchController],
  exports: [WatchService],
})
export class WatchModule {}
