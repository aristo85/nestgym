import { Inject, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { FEEDBACK_REPOSITORY } from 'src/core/constants';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { photoPositionTypes } from '../photos/dto/photo.dto';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
import { Profile } from '../profiles/profile.entity';
import { FeedbackDto } from './dto/feedback.dto';
import { Feedback, RatingCounter } from './feedback.entity';

@Injectable()
export class FeedbacksService {
  constructor(
    @Inject(FEEDBACK_REPOSITORY)
    private readonly feedbackRepository: typeof Feedback,
    private readonly photoService: PhotosService,
  ) {}

  async createFeedback(data: FeedbackDto, userId: number): Promise<Feedback> {
    const { coachId } = data;
    // const test = includePhotoOptions
    // photos
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);
    // client name
    const clientName = await Profile.findOne({
      where: { userId },
      attributes: ['fullName'],
      raw: true,
    });
    // coach name
    const coachName = await CoachProfile.findOne({
      where: { userId: coachId },
      attributes: ['fullName'],
      raw: true,
    });
    // create feedback
    const createdFeedback = await this.feedbackRepository.create<Feedback>({
      ...data,
      frontPhotoId: frontPhoto?.id,
      sidePhotoId: sidePhoto?.id,
      backPhotoId: backPhoto?.id,
      userId,
      clientName: clientName.fullName,
      coachName: coachName.fullName,
    });

    // calculate coach's rating
    if (createdFeedback) {
      const coachFeedbacks: RatingCounter[] = await Feedback.findAll({
        raw: true,
        nest: true,
        where: { coachId: data.coachId },
        attributes: [
          [sequelize.fn('sum', sequelize.col('rate')), 'total'],
          [sequelize.fn('count', sequelize.col('rate')), 'count'],
        ],
      });

      // const test: number = coachFeedbacks[0]
      const { total, count }: any = coachFeedbacks[0];
      const newRating = (total / count).toFixed(2);
      // update coach's rating
      await CoachProfile.update(
        { rating: newRating, ratingQuantity: count },
        { where: { userId: data.coachId } },
      );
    }

    return createdFeedback;
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
      // raw: true,
      // nest: true,
    });
  }

  async deleteFeedback(feedbackId: number, userId: number, role: string) {
    const optionCondition =
      role === 'admin' ? { id: feedbackId } : { id: feedbackId, userId };
    // find all photos in profile
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.findFeedbackWithPhotosForDeletion(feedbackId);

    // delete profile with this id
    const deleted = await this.feedbackRepository.destroy({
      where: optionCondition,
    });
    // if nothing to delete
    if (deleted === 0) {
      return deleted;
    }

    //remove photos from DB if was last module
    await this.photoService.checkPhotoPositionsAndDelete(
      frontPhoto,
      sidePhoto,
      backPhoto,
    );

    return deleted;
  }

  async findAllCoachFeedbacks(coachId): Promise<Feedback[]> {
    return await this.feedbackRepository.findAll<Feedback>({
      where: { coachId },
      include: [...includePhotoOptions],
    });
  }
  /////////////////////////////////////////////

  async deleteFeedbackPhoto(
    feedbackId: number,
    photoPosition: photoPositionTypes,
    photoId: number,
    photoFileName: string,
    userId,
  ) {
    const updateOptions =
      photoPosition === 'front'
        ? { frontPhotoId: null }
        : photoPosition === 'side'
        ? { sidePhotoId: null }
        : { backPhotoId: null };
    // update profile
    await this.feedbackRepository.update(updateOptions, {
      where: { id: feedbackId, userId: userId },
    });

    // delete the photo with this id
    const deleted = await this.photoService.deletePhoto(photoId, photoFileName);
    return deleted;
  }

  async findFeedbackByPhotoPosition(
    feedbackId: number,
    photoPosition: string,
    photoId: number,
    userId: number,
  ) {
    const dataOptions =
      photoPosition === 'front'
        ? { frontPhotoId: photoId }
        : photoPosition === 'side'
        ? { sidePhotoId: photoId }
        : { backPhotoId: photoId };
    return await this.feedbackRepository.findOne({
      where: { ...dataOptions, userId: userId, id: feedbackId },
    });
  }
  /////////////////////////////////////////////

  async findFeedbackWithPhotosForDeletion(feedbackId: number) {
    return await this.feedbackRepository.findOne({
      where: { id: feedbackId },
      include: [...includePhotoOptions],
      raw: true,
      nest: true,
    });
  }
}
