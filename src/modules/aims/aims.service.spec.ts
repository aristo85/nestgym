import { Test, TestingModule } from '@nestjs/testing';
import { AimsService } from './aims.service';

describe('AimsService', () => {
  let service: AimsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AimsService],
    }).compile();

    service = module.get<AimsService>(AimsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
