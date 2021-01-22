import { Test, TestingModule } from '@nestjs/testing';
import { UserDietsService } from './user-diets.service';

describe('UserDietsService', () => {
  let service: UserDietsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDietsService],
    }).compile();

    service = module.get<UserDietsService>(UserDietsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
