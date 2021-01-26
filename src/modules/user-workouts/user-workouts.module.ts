import { Module } from '@nestjs/common';
import { UserWorkoutsService } from './user-workouts.service';
import { UserWorkoutsController } from './user-workouts.controller';
import { userWorkoutProviders } from './user-workouts.providers';

@Module({
  providers: [UserWorkoutsService, ...userWorkoutProviders],
  controllers: [UserWorkoutsController]
})
export class UserWorkoutsModule {}
