import { Test, TestingModule } from '@nestjs/testing';
import { CoachAplicationService } from './coach-aplication.service';

describe('CoachAplicationService', () => {
  let service: CoachAplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachAplicationService],
    }).compile();

    service = module.get<CoachAplicationService>(CoachAplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
