import { Test, TestingModule } from '@nestjs/testing';
import { TemplateDietsController } from './template-diets.controller';

describe('TemplateDietsController', () => {
  let controller: TemplateDietsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateDietsController],
    }).compile();

    controller = module.get<TemplateDietsController>(TemplateDietsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
