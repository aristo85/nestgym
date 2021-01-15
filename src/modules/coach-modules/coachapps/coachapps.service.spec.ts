import { Test, TestingModule } from '@nestjs/testing';
import { CoachappsService } from './coachapps.service';

describe('CoachappsService', () => {
  let service: CoachappsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachappsService],
    }).compile();

    service = module.get<CoachappsService>(CoachappsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
