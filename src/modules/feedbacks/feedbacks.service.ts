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

  async createFeedback(data: FeedbackDto, userId: number): Promise<Feedback> {
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

  async findAllFeedbacks(): Promise<Feedback[]> {
    return await this.feedbackRepository.findAll<Feedback>({
      include: [...includePhotoOptions],
    });
  }

  async findOneFeedback(
    feedbackId: number,
    userId: number,
    role: string,
  ): Promise<Feedback> {
    const optionCondition =
      role === 'admin' ? { id: feedbackId } : { id: feedbackId, userId };
    return await this.feedbackRepository.findOne({
      where: optionCondition,
      include: [...includePhotoOptions],
    });
  }

  async deleteFeedback(feedbackId: number, userId: number, role: string) {
    const optionCondition =
      role === 'admin' ? { id: feedbackId } : { id: feedbackId, userId };
    return await this.feedbackRepository.destroy({
      where: optionCondition,
    });
  }
}
