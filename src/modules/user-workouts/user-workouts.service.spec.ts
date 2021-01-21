import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkoutsService } from './user-workouts.service';

describe('UserWorkoutsService', () => {
  let service: UserWorkoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWorkoutsService],
    }).compile();

    service = module.get<UserWorkoutsService>(UserWorkoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
