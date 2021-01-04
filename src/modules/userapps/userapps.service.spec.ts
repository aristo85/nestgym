import { Test, TestingModule } from '@nestjs/testing';
import { UserappsService } from './userapps.service';

describe('UserappsService', () => {
  let service: UserappsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserappsService],
    }).compile();

    service = module.get<UserappsService>(UserappsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
