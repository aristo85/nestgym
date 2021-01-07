import { Test, TestingModule } from '@nestjs/testing';
import { CoachProfilesService } from './coach-profiles.service';

describe('CoachProfilesService', () => {
  let service: CoachProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachProfilesService],
    }).compile();

    service = module.get<CoachProfilesService>(CoachProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
