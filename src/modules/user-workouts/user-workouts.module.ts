import { Module } from '@nestjs/common';
import { UserWorkoutsService } from './user-workouts.service';
import { UserWorkoutsController } from './user-workouts.controller';

@Module({
  providers: [UserWorkoutsService],
  controllers: [UserWorkoutsController]
})
export class UserWorkoutsModule {}
