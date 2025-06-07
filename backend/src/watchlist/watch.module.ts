import { Module } from '@nestjs/common';
import { WatchService } from './watch.service';
import { WatchRepository } from './watch.repository';
import { WatchController } from './watch.controller';

@Module({
  providers: [WatchService, WatchRepository],
  controllers: [WatchController],
  exports: [WatchService],
})
export class WatchModule {}
