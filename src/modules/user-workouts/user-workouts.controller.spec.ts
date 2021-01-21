import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkoutsController } from './user-workouts.controller';

describe('UserWorkoutsController', () => {
  let controller: UserWorkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWorkoutsController],
    }).compile();

    controller = module.get<UserWorkoutsController>(UserWorkoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
