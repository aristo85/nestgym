import { Inject, Injectable } from '@nestjs/common';
import { PROGRESS_REPOSITORY } from 'src/core/constants';
import { UserProgress } from './user-progress.entity';
import { UserProgressDto } from './dto/user-progress.dto';

@Injectable()
export class UserProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly userProgressRepository: typeof UserProgress,
  ) {}

  async create(progress: UserProgressDto, userId): Promise<UserProgress> {
    return await this.userProgressRepository.create<UserProgress>({
      ...progress,
      userId,
    });
  }

  async findOne(id, userId): Promise<UserProgress> {
    return await this.userProgressRepository.findOne({
      where: { id, userId },
    });
  }

  async findAll(userId): Promise<UserProgress[]> {
    return await this.userProgressRepository.findAll<UserProgress>({
      where: { userId },
    });
  }

  async delete(id, userId) {
    return await this.userProgressRepository.destroy({ where: { id, userId } });
  }
}
