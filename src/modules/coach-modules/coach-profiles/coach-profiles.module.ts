import { Module } from '@nestjs/common';
import { CoachProfilesService } from './coach-profiles.service';
import { CoachProfilesController } from './coach-profiles.controller';
import { coachProfilesProviders } from './coach-profiles.providers';

@Module({
  providers: [CoachProfilesService, ...coachProfilesProviders],
  exports: [CoachProfilesService],
  controllers: [CoachProfilesController]
})
export class CoachProfilesModule {}
