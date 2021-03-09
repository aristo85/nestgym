import { Test, TestingModule } from '@nestjs/testing';
import { DietsController } from './diets.controller';

describe('DietsController', () => {
  let controller: DietsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietsController],
    }).compile();

    controller = module.get<DietsController>(DietsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
