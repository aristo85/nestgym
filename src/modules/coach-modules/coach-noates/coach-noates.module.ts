import { Module } from '@nestjs/common';
import { CoachNoatesService } from './coach-noates.service';
import { CoachNoatesController } from './coach-noates.controller';
import { coachNotesProviders } from './coach-notoes.providers';

@Module({
  providers: [CoachNoatesService, ...coachNotesProviders],
  controllers: [CoachNoatesController],
})
export class CoachNoatesModule {}
