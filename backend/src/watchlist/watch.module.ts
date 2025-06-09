import { Module } from '@nestjs/common';
import { WatchService } from './watch.service';
import { WatchRepository } from './watch.repository';
import { WatchController } from './watch.controller';
import { PriceRepository } from '../infra/repositories/price.repository';

@Module({
  providers: [WatchService, WatchRepository, PriceRepository],
  controllers: [WatchController],
  exports: [WatchService],
})
export class WatchModule {}
