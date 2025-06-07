import { Injectable } from '@nestjs/common';
import { Watch } from './watch.entity';

@Injectable()
export class WatchRepository {
  private store = new Map<string, Watch[]>();

  findAll(uid: string): Promise<Watch[]> {
    return Promise.resolve(this.store.get(uid) ?? []);
  }

  save(watch: Watch): Promise<void> {
    const arr = this.store.get(watch.uid) ?? [];
    arr.push(watch);
    this.store.set(watch.uid, arr);
    return Promise.resolve();
  }

  remove(uid: string, code: string): Promise<void> {
    const arr = this.store.get(uid) ?? [];
    this.store.set(
      uid,
      arr.filter((w) => w.code !== code),
    );
    return Promise.resolve();
  }
}
