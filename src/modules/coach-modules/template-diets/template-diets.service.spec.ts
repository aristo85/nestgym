import { Test, TestingModule } from '@nestjs/testing';
import { TemplateDietsService } from './template-diets.service';

describe('TemplateDietsService', () => {
  let service: TemplateDietsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateDietsService],
    }).compile();

    service = module.get<TemplateDietsService>(TemplateDietsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
