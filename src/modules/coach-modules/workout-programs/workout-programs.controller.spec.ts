import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutProgramsController } from './workout-programs.controller';

describe('WorkoutProgramsController', () => {
  let controller: WorkoutProgramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutProgramsController],
    }).compile();

    controller = module.get<WorkoutProgramsController>(WorkoutProgramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
