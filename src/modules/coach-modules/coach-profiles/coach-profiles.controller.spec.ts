import { Test, TestingModule } from '@nestjs/testing';
import { CoachProfilesController } from './coach-profiles.controller';

describe('CoachProfilesController', () => {
  let controller: CoachProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachProfilesController],
    }).compile();

    controller = module.get<CoachProfilesController>(CoachProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
