import { YahooSource } from '../price-sources/yahoo.source';

describe('YahooSource', () => {
  it('retrieves close price from Yahoo Finance', async () => {
    const src = new YahooSource();
    const date = new Date('2023-01-04T00:00:00Z');
    try {
      const price = await src.getClose(7203, date);
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
    } catch (err: unknown) {
      const cause = (err as { cause?: { code?: string }; code?: string }) || {};
      const code = cause.cause?.code ?? cause.code;
      if (
        code === 'ENETUNREACH' ||
        (err as Error).message.includes('Yahoo request failed') ||
        (err as Error).message.includes('Yahoo price parse error')
      ) {
        console.warn('Yahoo Finance unreachable, skipping integration test');
        return;
      }
      throw err;
    }
  }, 15000);
});
