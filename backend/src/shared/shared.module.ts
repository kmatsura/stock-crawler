import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import type { TransformableInfo } from 'logform';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              (info: TransformableInfo & { context?: string }) => {
                const ts = info.timestamp as string;
                const ctx = info.context ? `[${info.context}]` : '';
                const msg = String(info.message);
                return `${ts} [${info.level}]${ctx}: ${msg}`;
              },
            ),
          ),
        }),
      ],
    }),
  ],
  providers: [LoggerService],
  exports: [ConfigModule, WinstonModule, LoggerService],
})
export class SharedModule {}
