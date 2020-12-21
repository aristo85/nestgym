import { Test, TestingModule } from '@nestjs/testing';
import { CoachAplicationController } from './coach-aplication.controller';

describe('CoachAplicationController', () => {
  let controller: CoachAplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachAplicationController],
    }).compile();

    controller = module.get<CoachAplicationController>(CoachAplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
