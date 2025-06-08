import { IPriceSource } from '../price-sources/IPriceSource';
import { PriceRepository } from '../infra/repositories/price.repository';

export class CrawlerService {
  constructor(
    private readonly sources: IPriceSource[],
    private readonly repo: PriceRepository,
  ) {}

  async fetchAndSave(code: number, date = new Date()) {
    let price: number | undefined;
    for (const src of this.sources) {
      try {
        price = await src.getClose(code, date);
        break;
      } catch {
        // try next source
      }
    }
    if (price === undefined) {
      throw new Error('All price sources failed');
    }
    const item = {
      PK: `STOCK#${code}#${date.getUTCFullYear()}`,
      SK: `PRICE#${date.toISOString()}`,
      entityType: 'PRICE',
      code,
      session: 'CLOSE',
      tsISO: date.toISOString(),
      price,
    };
    await this.repo.put(item);
    return item;
  }
}
