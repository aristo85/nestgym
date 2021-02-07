import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutProgramsService } from './workout-programs.service';

describe('WorkoutProgramsService', () => {
  let service: WorkoutProgramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutProgramsService],
    }).compile();

    service = module.get<WorkoutProgramsService>(WorkoutProgramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
