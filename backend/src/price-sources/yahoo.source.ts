import { IPriceSource } from './IPriceSource';

export class YahooSource implements IPriceSource {
  readonly name = 'yahoo';

  async getClose(code: number, date: Date): Promise<number> {
    const symbol = `${code}.T`;
    const period = Math.floor(date.getTime() / 1000);
    const crumb = process.env.YF_CRUMB;
    let url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${period}&period2=${period}&interval=1d&events=history&includeAdjustedClose=true`;
    if (crumb) {
      url += `&crumb=${encodeURIComponent(crumb)}`;
    }
    const headers: Record<string, string> = {};
    if (process.env.YF_COOKIE) {
      headers['Cookie'] = process.env.YF_COOKIE;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Yahoo request failed: ${res.status}`);
    }
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Yahoo response missing data');
    }
    const cols = lines[1].split(',');
    const price = Number(cols[4]);
    if (Number.isNaN(price)) {
      throw new Error('Yahoo price parse error');
    }
    return price;
  }
}
