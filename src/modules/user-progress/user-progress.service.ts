import { Inject, Injectable } from '@nestjs/common';
import { PROGRESS_REPOSITORY } from 'src/core/constants';
import { UserProgress } from './user-progress.entity';
import { UserProgressDto } from './dto/user-progress.dto';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';

@Injectable()
export class UserProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly userProgressRepository: typeof UserProgress,
    private readonly photoService: PhotosService,
  ) {}

  async create(progress: UserProgressDto, userId): Promise<UserProgress> {
    // photos
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(progress);

    return await this.userProgressRepository.create<UserProgress>({
      ...progress,
      frontPhotoId: frontPhoto?.id,
      sidePhotoId: sidePhoto?.id,
      backPhotoId: backPhoto?.id,
      userId,
    });
  }

  async findOne(id, userId): Promise<UserProgress> {
    return await this.userProgressRepository.findOne({
      where: { id, userId },
      include: [...includePhotoOptions],
    });
  }

  async findAll(userId): Promise<UserProgress[]> {
    return await this.userProgressRepository.findAll<UserProgress>({
      where: { userId },
      include: [...includePhotoOptions],
    });
  }

  async delete(id, userId) {
    return await this.userProgressRepository.destroy({ where: { id, userId } });
  }
}
