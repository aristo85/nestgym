import { Test, TestingModule } from '@nestjs/testing';
import { TemplateWorkoutsController } from './template-workouts.controller';

describe('TemplateWorkoutsController', () => {
  let controller: TemplateWorkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateWorkoutsController],
    }).compile();

    controller = module.get<TemplateWorkoutsController>(TemplateWorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
