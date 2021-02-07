import { Module } from '@nestjs/common';
import { CoachServicesService } from './coach-services.service';
import { CoachServicesController } from './coach-services.controller';
import { coachServisesProviders } from './coach-services.providers';

@Module({
  providers: [CoachServicesService, ...coachServisesProviders],
  exports: [CoachServicesService],
  controllers: [CoachServicesController]
})
export class CoachServicesModule {}
