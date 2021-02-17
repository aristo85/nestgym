import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { PhotosModule } from '../photos/photos.module';
import { feedbacksProviders } from './feedbacks.providers';

@Module({
  providers: [FeedbacksService, ...feedbacksProviders],
  controllers: [FeedbacksController],
  imports: [PhotosModule],
})
export class FeedbacksModule {}
