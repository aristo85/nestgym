import { Inject, Injectable } from '@nestjs/common';
import { PROGRESS_REPOSITORY } from 'src/core/constants';
import { UserProgress } from './user-progress.entity';
import { UserProgressDto } from './dto/user-progress.dto';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
import { Profile } from '../profiles/profile.entity';

@Injectable()
export class UserProgressService {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly userProgressRepository: typeof UserProgress,
    private readonly photoService: PhotosService,
  ) {}

  async createProgress(
    progress: UserProgressDto,
    userId: number,
  ): Promise<UserProgress> {
    // photos
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(progress);

    // BMI and %fat
    if (progress.weight && progress.weight > 20) {
      // get profile
      const profile: Profile = await Profile.findOne({
        where: { userId },
        raw: true,
        nest: true,
      });

      if (profile && profile.height) {
        const weight = progress.weight;
        const height = profile.height;
        const gender = profile.gender;
        const age = profile.age;

        // calculate BMI
        const BMI = (weight / Math.pow(height / 100, 2)).toFixed(1);

        // calculate %fat
        const fatPercentage =
          gender === 'male' && age > 40
            ? (1.2 * +BMI + 0.23 * age - 16.2).toFixed(1) + '%'
            : gender === 'female' && age > 40
            ? (1.2 * +BMI + 0.23 * age - 5.4).toFixed(1) + '%'
            : gender === 'male' && age < 40
            ? (1.51 * +BMI - 0.7 * age - 2.2).toFixed(1) + '%'
            : gender === 'female' && age < 40
            ? (1.51 * +BMI - 0.7 * age + 1.4).toFixed(1) + '%'
            : +BMI < 21
            ? '13,5-24%'
            : +BMI < 31
            ? '25,5-39%'
            : '40,5-54%';

        return await this.userProgressRepository.create<UserProgress>({
          ...progress,
          frontPhotoId: frontPhoto?.id,
          sidePhotoId: sidePhoto?.id,
          backPhotoId: backPhoto?.id,
          userId,
          BMI,
          fatPercentage,
        });
      }
    }

    return await this.userProgressRepository.create<UserProgress>({
      ...progress,
      frontPhotoId: frontPhoto?.id,
      sidePhotoId: sidePhoto?.id,
      backPhotoId: backPhoto?.id,
      userId,
    });
  }

  async findOneProgress(
    progressId: number,
    userId: number,
  ): Promise<UserProgress> {
    return await this.userProgressRepository.findOne({
      where: { id: progressId, userId },
      include: [...includePhotoOptions],
    });
  }

  async findAllProgresses(userId: number): Promise<UserProgress[]> {
    return await this.userProgressRepository.findAll<UserProgress>({
      where: { userId },
      include: [...includePhotoOptions],
    });
  }

  async deleteProgress(progressId: number, userId: number) {
    return await this.userProgressRepository.destroy({
      where: { id: progressId, userId },
    });
  }
}
