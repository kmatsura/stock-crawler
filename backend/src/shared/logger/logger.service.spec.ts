// src/shared/logger/logger.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('LoggerService', () => {
  let service: LoggerService;

  // モックロガー
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('log() should call logger.info', () => {
    service.log('hello', 'ctx');
    expect(mockLogger.info).toHaveBeenCalledWith('hello', { context: 'ctx' });
  });

  it('error() should call logger.error', () => {
    service.error('oops', 'stack', 'ctx');
    expect(mockLogger.error).toHaveBeenCalledWith('oops', {
      trace: 'stack',
      context: 'ctx',
    });
  });

  it('warn() should call logger.warn', () => {
    service.warn('watch out', 'ctx');
    expect(mockLogger.warn).toHaveBeenCalledWith('watch out', {
      context: 'ctx',
    });
  });

  it('debug() should call logger.debug', () => {
    service.debug('detail', 'ctx');
    expect(mockLogger.debug).toHaveBeenCalledWith('detail', { context: 'ctx' });
  });
});
