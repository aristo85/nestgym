import { Test, TestingModule } from '@nestjs/testing';
import { CoachNoatesController } from './coach-noates.controller';

describe('CoachNoatesController', () => {
  let controller: CoachNoatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachNoatesController],
    }).compile();

    controller = module.get<CoachNoatesController>(CoachNoatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
