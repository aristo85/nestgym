import { Test, TestingModule } from '@nestjs/testing';
import { RequestedappsService } from './requestedapps.service';

describe('RequestedappsService', () => {
  let service: RequestedappsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestedappsService],
    }).compile();

    service = module.get<RequestedappsService>(RequestedappsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
