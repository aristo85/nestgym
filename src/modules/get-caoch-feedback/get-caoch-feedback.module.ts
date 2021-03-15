import { Module } from '@nestjs/common';
import { GetCaochFeedbackService } from './get-caoch-feedback.service';
import { GetCaochFeedbackController } from './get-caoch-feedback.controller';
import { GCFeedbacksProviders } from './get-caoch-feedback.providers';

@Module({
  providers: [GetCaochFeedbackService, ...GCFeedbacksProviders],
  controllers: [GetCaochFeedbackController],
})
export class GetCaochFeedbackModule {}
