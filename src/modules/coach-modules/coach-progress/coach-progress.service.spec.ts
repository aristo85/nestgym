import { Test, TestingModule } from '@nestjs/testing';
import { CoachProgressService } from './coach-progress.service';

describe('CoachProgressService', () => {
  let service: CoachProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachProgressService],
    }).compile();

    service = module.get<CoachProgressService>(CoachProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
