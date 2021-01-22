import { Test, TestingModule } from '@nestjs/testing';
import { AimsController } from './aims.controller';

describe('AimsController', () => {
  let controller: AimsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AimsController],
    }).compile();

    controller = module.get<AimsController>(AimsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
