import { Test, TestingModule } from '@nestjs/testing';
import { UserDietsController } from './user-diets.controller';

describe('UserDietsController', () => {
  let controller: UserDietsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDietsController],
    }).compile();

    controller = module.get<UserDietsController>(UserDietsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
