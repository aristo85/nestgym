import { Module } from '@nestjs/common';
import { CoachProgressService } from './coach-progress.service';
import { CoachProgressController } from './coach-progress.controller';

@Module({
  providers: [CoachProgressService],
  controllers: [CoachProgressController]
})
export class CoachProgressModule {}
