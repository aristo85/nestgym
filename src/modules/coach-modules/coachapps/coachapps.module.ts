import { Module } from '@nestjs/common';
import { CoachappsService } from './coachapps.service';
import { CoachappsController } from './coachapps.controller';
import { coachappsProviders } from './coachapps.providers';

@Module({
  providers: [CoachappsService, ...coachappsProviders],
  controllers: [CoachappsController],
})
export class CoachappsModule {}
