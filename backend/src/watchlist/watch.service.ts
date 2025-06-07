import { Injectable } from '@nestjs/common';
import { WatchRepository } from './watch.repository';
import { Watch } from './watch.entity';

@Injectable()
export class WatchService {
  constructor(private readonly repo: WatchRepository) {}

  findAll(uid: string): Promise<Watch[]> {
    return this.repo.findAll(uid);
  }

  async create(uid: string, code: string): Promise<Watch> {
    const watch: Watch = { uid, code, createdAt: new Date().toISOString() };
    await this.repo.save(watch);
    return watch;
  }

  remove(uid: string, code: string): Promise<void> {
    return this.repo.remove(uid, code);
  }
}
