import { Test, TestingModule } from '@nestjs/testing';
import { CoachappsController } from './coachapps.controller';

describe('CoachappsController', () => {
  let controller: CoachappsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachappsController],
    }).compile();

    controller = module.get<CoachappsController>(CoachappsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
