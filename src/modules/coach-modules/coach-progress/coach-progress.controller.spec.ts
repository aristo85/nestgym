import { Test, TestingModule } from '@nestjs/testing';
import { CoachProgressController } from './coach-progress.controller';

describe('CoachProgressController', () => {
  let controller: CoachProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachProgressController],
    }).compile();

    controller = module.get<CoachProgressController>(CoachProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
