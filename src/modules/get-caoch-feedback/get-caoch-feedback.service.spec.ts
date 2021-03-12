import { Test, TestingModule } from '@nestjs/testing';
import { GetCaochFeedbackService } from './get-caoch-feedback.service';

describe('GetCaochFeedbackService', () => {
  let service: GetCaochFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetCaochFeedbackService],
    }).compile();

    service = module.get<GetCaochFeedbackService>(GetCaochFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
