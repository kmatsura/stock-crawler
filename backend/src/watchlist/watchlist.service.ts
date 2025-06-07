import { Injectable } from '@nestjs/common';
import { Watch } from './watch.entity';

@Injectable()
export class WatchlistService {
  private data = new Map<string, Watch[]>();

  /** 指定ユーザーのウォッチリスト取得 */
  async findAll(uid: string): Promise<Watch[]> {
    return Promise.resolve(this.data.get(uid) ?? []);
  }

  /** ウォッチ登録 */
  async create(uid: string, code: string): Promise<Watch> {
    const watch: Watch = { uid, code, createdAt: new Date().toISOString() };
    const arr = this.data.get(uid) ?? [];
    arr.push(watch);
    this.data.set(uid, arr);
    return Promise.resolve(watch);
  }

  /** 指定コードをウォッチから削除 */
  async remove(uid: string, code: string): Promise<void> {
    const arr = this.data.get(uid);
    if (arr) {
      this.data.set(
        uid,
        arr.filter((w) => w.code !== code),
      );
    }
    return Promise.resolve();
  }
}
