import { IPriceSource } from './IPriceSource';
import { fetch as undiciFetch, ProxyAgent } from 'undici';

const proxy = process.env.https_proxy || process.env.HTTPS_PROXY;

export class YahooSource implements IPriceSource {
  readonly name = 'yahoo';

  private dispatcher = proxy ? new ProxyAgent(proxy) : undefined;

  private async refreshAuth(): Promise<void> {
    const cookieRes = await undiciFetch('https://fc.yahoo.com', {
      dispatcher: this.dispatcher,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const setCookie = cookieRes.headers.get('set-cookie') ?? '';
    const cookie = setCookie.split(';')[0];
    const crumbRes = await undiciFetch(
      'https://query1.finance.yahoo.com/v1/test/getcrumb',
      {
        headers: { Cookie: cookie, 'User-Agent': 'Mozilla/5.0' },
        dispatcher: this.dispatcher,
      },
    );
    if (!crumbRes.ok) {
      throw new Error(`Yahoo crumb request failed: ${crumbRes.status}`);
    }
    const crumb = (await crumbRes.text()).trim();
    process.env.YF_COOKIE = cookie;
    process.env.YF_CRUMB = crumb;
  }

  private buildUrl(symbol: string, period: number): string {
    let url =
      `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${period}&period2=${period}` +
      '&interval=1d&events=history&includeAdjustedClose=true';
    const crumb = process.env.YF_CRUMB;
    if (crumb) {
      url += `&crumb=${encodeURIComponent(crumb)}`;
    }
    return url;
  }

  private async download(
    symbol: string,
    period: number,
    headers: Record<string, string>,
  ): Promise<string> {
    let url = this.buildUrl(symbol, period);
    let res = await undiciFetch(url, {
      headers,
      dispatcher: this.dispatcher,
    });
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      await this.refreshAuth();
      headers = { 'User-Agent': 'Mozilla/5.0' };
      if (process.env.YF_COOKIE) {
        headers['Cookie'] = process.env.YF_COOKIE;
      }
      url = this.buildUrl(symbol, period);
      res = await undiciFetch(url, { headers, dispatcher: this.dispatcher });
    }
    if (!res.ok) {
      throw new Error(`Yahoo request failed: ${res.status}`);
    }
    return res.text();
  }

  async getClose(code: number, date: Date): Promise<number> {
    const symbol = `${code}.T`;
    const period = Math.floor(date.getTime() / 1000);
    if (!process.env.YF_COOKIE || !process.env.YF_CRUMB) {
      await this.refreshAuth();
    }
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0',
    };
    if (process.env.YF_COOKIE) {
      headers['Cookie'] = process.env.YF_COOKIE;
    }
    const text = await this.download(symbol, period, headers);
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
