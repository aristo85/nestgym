import { Inject, Injectable } from '@nestjs/common';
import { FEEDBACK_REPOSITORY } from 'src/core/constants';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
import { FeedbackDto } from './dto/feedback.dto';
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @Inject(FEEDBACK_REPOSITORY)
    private readonly feedbackRepository: typeof Feedback,
    private readonly photoService: PhotosService,
  ) {}

  async create(data: FeedbackDto, userId): Promise<Feedback> {
    // const test = includePhotoOptions
    // photos
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);

    return await this.feedbackRepository.create<Feedback>({
      ...data,
      frontPhotoId: frontPhoto?.id,
      sidePhotoId: sidePhoto?.id,
      backPhotoId: backPhoto?.id,
      userId,
    });
  }

  async findOne(id, userId): Promise<Feedback> {
    return await this.feedbackRepository.findOne({
      where: { id, userId },
      include: [...includePhotoOptions],
    });
  }

  async findAll(userId): Promise<Feedback[]> {
    return await this.feedbackRepository.findAll<Feedback>({
      where: { userId },
      include: [...includePhotoOptions],
    });
  }

  async delete(id, userId) {
    return await this.feedbackRepository.destroy({ where: { id, userId } });
  }
}
