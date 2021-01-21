import { Test, TestingModule } from '@nestjs/testing';
import { DietproductsService } from './dietproducts.service';

describe('DietproductsService', () => {
  let service: DietproductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietproductsService],
    }).compile();

    service = module.get<DietproductsService>(DietproductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
