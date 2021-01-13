import { Module } from '@nestjs/common';
import { RequestedappsService } from './requestedapps.service';
import { RequestedappsController } from './requestedapps.controller';
import { CoachProfilesModule } from '../coach-modules/coach-profiles/coach-profiles.module';

@Module({
  imports: [CoachProfilesModule],
  providers: [RequestedappsService],
  controllers: [RequestedappsController]
})
export class RequestedappsModule {}
