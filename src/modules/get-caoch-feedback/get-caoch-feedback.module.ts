import { Module } from '@nestjs/common';
import { GetCaochFeedbackService } from './get-caoch-feedback.service';
import { GetCaochFeedbackController } from './get-caoch-feedback.controller';

@Module({
  providers: [GetCaochFeedbackService],
  controllers: [GetCaochFeedbackController]
})
export class GetCaochFeedbackModule {}
