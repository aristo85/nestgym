import { Module } from '@nestjs/common';
import { WorkoutProgramsService } from './workout-programs.service';
import { WorkoutProgramsController } from './workout-programs.controller';
import { workoutProgramsProviders } from './workout-programs.providers';

@Module({
  providers: [WorkoutProgramsService, ...workoutProgramsProviders],
  exports: [WorkoutProgramsService],
  controllers: [WorkoutProgramsController]
})
export class WorkoutProgramsModule {}
