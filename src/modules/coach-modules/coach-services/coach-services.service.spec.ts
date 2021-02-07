import { Test, TestingModule } from '@nestjs/testing';
import { CoachServicesService } from './coach-services.service';

describe('CoachServicesService', () => {
  let service: CoachServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachServicesService],
    }).compile();

    service = module.get<CoachServicesService>(CoachServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
