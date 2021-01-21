import { Test, TestingModule } from '@nestjs/testing';
import { DietprogramController } from './dietprogram.controller';

describe('DietprogramController', () => {
  let controller: DietprogramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietprogramController],
    }).compile();

    controller = module.get<DietprogramController>(DietprogramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
