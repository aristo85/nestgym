import { Test, TestingModule } from '@nestjs/testing';
import { CoachServicesController } from './coach-services.controller';

describe('CoachServicesController', () => {
  let controller: CoachServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachServicesController],
    }).compile();

    controller = module.get<CoachServicesController>(CoachServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
