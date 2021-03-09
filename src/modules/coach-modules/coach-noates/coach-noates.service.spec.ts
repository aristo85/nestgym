import { Test, TestingModule } from '@nestjs/testing';
import { CoachNoatesService } from './coach-noates.service';

describe('CoachNoatesService', () => {
  let service: CoachNoatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachNoatesService],
    }).compile();

    service = module.get<CoachNoatesService>(CoachNoatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
