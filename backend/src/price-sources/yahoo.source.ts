import { IPriceSource } from './IPriceSource';
import { fetch as undiciFetch, ProxyAgent } from 'undici';

const proxy = process.env.https_proxy || process.env.HTTPS_PROXY;

export class YahooSource implements IPriceSource {
  readonly name = 'yahoo';

  private dispatcher = proxy ? new ProxyAgent(proxy) : undefined;

  async getClose(code: number, date: Date): Promise<number> {
    const symbol = `${code}.T`;
    const ts = Math.floor(date.getTime() / 1000);
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
      `?period1=${ts}&period2=${ts}&interval=1d`;
    const res = await undiciFetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      dispatcher: this.dispatcher,
    });
    if (!res.ok) {
      throw new Error(`Yahoo request failed: ${res.status}`);
    }
    const json = (await res.json()) as {
      chart?: {
        result?: Array<{
          indicators?: { quote?: Array<{ close?: number[] }> };
        }>;
      };
    };
    const price = json.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.[0];
    if (typeof price !== 'number') {
      throw new Error('Yahoo price parse error');
    }
    return price;
  }
}
