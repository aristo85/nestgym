import { Module } from '@nestjs/common';
import { TemplateWorkoutsService } from './template-workouts.service';
import { TemplateWorkoutsController } from './template-workouts.controller';
import { templateWorkoutsProviders } from './template-workouts.providers';

@Module({
  providers: [TemplateWorkoutsService, ...templateWorkoutsProviders],
  controllers: [TemplateWorkoutsController],
})
export class TemplateWorkoutsModule {}
