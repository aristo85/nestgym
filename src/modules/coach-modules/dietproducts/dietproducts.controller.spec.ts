import { Test, TestingModule } from '@nestjs/testing';
import { DietproductsController } from './dietproducts.controller';

describe('DietproductsController', () => {
  let controller: DietproductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietproductsController],
    }).compile();

    controller = module.get<DietproductsController>(DietproductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
