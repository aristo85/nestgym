import { Test, TestingModule } from '@nestjs/testing';
import { GetCaochFeedbackController } from './get-caoch-feedback.controller';

describe('GetCaochFeedbackController', () => {
  let controller: GetCaochFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetCaochFeedbackController],
    }).compile();

    controller = module.get<GetCaochFeedbackController>(GetCaochFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
