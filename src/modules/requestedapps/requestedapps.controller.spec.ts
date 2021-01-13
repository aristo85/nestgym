import { Test, TestingModule } from '@nestjs/testing';
import { RequestedappsController } from './requestedapps.controller';

describe('RequestedappsController', () => {
  let controller: RequestedappsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestedappsController],
    }).compile();

    controller = module.get<RequestedappsController>(RequestedappsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
