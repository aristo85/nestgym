import { Inject, Injectable } from '@nestjs/common';
import { G_C_FEEDBACK_REPOSITORY } from 'src/core/constants';
import { Profile } from '../profiles/profile.entity';
import { GCFeedback } from './get-caoch-feedback.entity';
import { GCFeedbackDto } from './dto/get-caoch-feedback.dto';

@Injectable()
export class GetCaochFeedbackService {
  constructor(
    @Inject(G_C_FEEDBACK_REPOSITORY)
    private readonly GCFeedbackRepository: typeof GCFeedback,
  ) {}

  async createGCFeedback(
    data: GCFeedbackDto,
    userId: number,
    userName: string,
  ): Promise<GCFeedback> {
    // create feedback
    const createdFeedback = await this.GCFeedbackRepository.create<GCFeedback>({
      ...data,
      userId,
      userName,
    });
    return createdFeedback;
  }

  async findAllFeedbacks(): Promise<GCFeedback[]> {
    return await this.GCFeedbackRepository.findAll<GCFeedback>({});
  }

  async findOneGCFeedback(feedbackId: number): Promise<GCFeedback> {
    return await this.GCFeedbackRepository.findOne({
      where: { id: feedbackId },
    });
  }

  async deleteGCFeedback(feedbackId: number) {
    // delete feedback with this id
    const deleted = await this.GCFeedbackRepository.destroy({
      where: { id: feedbackId },
    });
    return deleted;
  }
  /////////////////////////////////////////////
}
