import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { HealthController } from './health/health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WatchModule } from './watchlist/watch.module';

@Module({
  imports: [SharedModule, UsersModule, AuthModule, WatchModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
