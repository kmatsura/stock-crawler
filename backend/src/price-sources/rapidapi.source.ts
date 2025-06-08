import { IPriceSource } from './IPriceSource';
import { fetch as undiciFetch, ProxyAgent } from 'undici';

const proxy = process.env.https_proxy || process.env.HTTPS_PROXY;

export class RapidAPISource implements IPriceSource {
  readonly name = 'rapidapi';

  private dispatcher = proxy ? new ProxyAgent(proxy) : undefined;

  async getClose(code: number, date: Date): Promise<number> {
    const symbol = `${code}.T`;
    const url = `https://yh-finance.p.rapidapi.com/stock/v3/get-historical-data?symbol=${symbol}`;
    const res = await undiciFetch(url, {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY ?? '',
      },
      dispatcher: this.dispatcher,
    });
    if (!res.ok) {
      throw new Error(`RapidAPI request failed: ${res.status}`);
    }
    type Price = { date: number; close: number };
    type ApiResponse = { prices?: Price[] };
    const json = (await res.json()) as ApiResponse;
    const ts = Math.floor(date.getTime() / 1000);
    const entry = json.prices?.find((p) => p.date === ts);
    if (!entry) {
      throw new Error('RapidAPI price not found');
    }
    return entry.close;
  }
}
