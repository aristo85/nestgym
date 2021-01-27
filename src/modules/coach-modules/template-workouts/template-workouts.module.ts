import { Module } from '@nestjs/common';
import { TemplateWorkoutsService } from './template-workouts.service';
import { TemplateWorkoutsController } from './template-workouts.controller';
import { templateWorkoutsProviders } from './template-workouts.providers';
import { WorkoutProgramsModule } from '../workout-programs/workout-programs.module';

@Module({
  providers: [TemplateWorkoutsService, ...templateWorkoutsProviders],
  imports: [WorkoutProgramsModule],
  controllers: [TemplateWorkoutsController]
})
export class TemplateWorkoutsModule {}
