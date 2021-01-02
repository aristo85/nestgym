import { Module } from '@nestjs/common';
import { CoachProfilesService } from './coach-profiles.service';
import { CoachProfilesController } from './coach-profiles.controller';

@Module({
  providers: [CoachProfilesService],
  controllers: [CoachProfilesController]
})
export class CoachProfilesModule {}
