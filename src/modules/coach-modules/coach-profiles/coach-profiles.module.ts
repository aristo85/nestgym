import { Module } from '@nestjs/common';
import { CoachProfilesService } from './coach-profiles.service';
import { CoachProfilesController } from './coach-profiles.controller';
import { coachProfilesProviders } from './coach-profiles.providers';
import { CoachServicesModule } from '../coach-services/coach-services.module';

@Module({
  providers: [CoachProfilesService, ...coachProfilesProviders],
  imports: [CoachServicesModule],
  exports: [CoachProfilesService],
  controllers: [CoachProfilesController]
})
export class CoachProfilesModule {}
