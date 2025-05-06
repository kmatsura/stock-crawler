import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  check() {
    const env: string = this.config.get<string>('NODE_ENV', 'development');
    const ver: string = this.config.get<string>('npm_package_version', '');
    const ts: string = new Date().toISOString();

    return {
      status: 'ok',
      env,
      ver,
      ts,
    };
  }
}
