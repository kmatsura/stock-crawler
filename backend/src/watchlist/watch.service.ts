import { Injectable } from '@nestjs/common';
import { WatchRepository } from './watch.repository';
import { Watch } from './watch.entity';
import { PriceRepository } from '../infra/repositories/price.repository';
import { WatchWithPrice } from './dto/watch-with-price.dto';
import { CrawlerService } from '../crawler/crawler.service';

@Injectable()
export class WatchService {
  constructor(
    private readonly repo: WatchRepository,
    private readonly priceRepo: PriceRepository,
    private readonly crawler: CrawlerService,
  ) {}

  async findAll(uid: string): Promise<WatchWithPrice[]> {
    const watches = await this.repo.findAll(uid);
    const result: WatchWithPrice[] = [];
    for (const w of watches) {
      const price = await this.priceRepo.findLatestPriceByCode(Number(w.code));
      result.push({
        ...w,
        latestPrice: price?.price,
        yieldPercent: price ? 0 : undefined,
      });
    }
    return result;
  }

  async create(uid: string, code: string): Promise<Watch> {
    const watch: Watch = { uid, code, createdAt: new Date().toISOString() };
    await this.repo.save(watch);
    return watch;
  }

  async refreshPrices(uid: string): Promise<WatchWithPrice[]> {
    const watches = await this.repo.findAll(uid);
    for (const w of watches) {
      try {
        await this.crawler.fetchAndSave(Number(w.code));
      } catch {
        // ignore individual failures
      }
    }
    return this.findAll(uid);
  }

  remove(uid: string, code: string): Promise<void> {
    return this.repo.remove(uid, code);
  }
}
