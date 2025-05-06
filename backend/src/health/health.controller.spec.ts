// src/health/health.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { ConfigService } from '@nestjs/config';

describe('HealthController', () => {
  let controller: HealthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: () => {
              // テスト中は常に 'test' を返す
              return 'test';
            },
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return ok status', () => {
    const res = controller.check();
    expect(res.status).toBe('ok');
  });

  it('should include env and ver as "test"', () => {
    const res = controller.check();
    expect(res.env).toBe('test');
    expect(res.ver).toBe('test');
  });

  it('should include a timestamp string', () => {
    const res = controller.check();
    expect(typeof res.ts).toBe('string');
    // ISO 8601 形式かどうかのざっくりチェック
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(res.ts)).toBe(true);
  });
});
