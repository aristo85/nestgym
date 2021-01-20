import { Test, TestingModule } from '@nestjs/testing';
import { FullProgworkoutsController } from './full-progworkouts.controller';

describe('FullProgworkoutsController', () => {
  let controller: FullProgworkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FullProgworkoutsController],
    }).compile();

    controller = module.get<FullProgworkoutsController>(FullProgworkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
