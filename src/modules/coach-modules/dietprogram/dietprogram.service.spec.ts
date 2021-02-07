import { Test, TestingModule } from '@nestjs/testing';
import { DietprogramService } from './dietprogram.service';

describe('DietprogramService', () => {
  let service: DietprogramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietprogramService],
    }).compile();

    service = module.get<DietprogramService>(DietprogramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
