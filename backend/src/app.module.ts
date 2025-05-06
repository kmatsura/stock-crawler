import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [SharedModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
