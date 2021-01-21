import { Test, TestingModule } from '@nestjs/testing';
import { FullProgworkoutsService } from './full-progworkouts.service';

describe('FullProgworkoutsService', () => {
  let service: FullProgworkoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FullProgworkoutsService],
    }).compile();

    service = module.get<FullProgworkoutsService>(FullProgworkoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
