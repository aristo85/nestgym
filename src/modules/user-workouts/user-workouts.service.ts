import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_WORKOUT_REPOSITORY } from 'src/core/constants';
import { UserWorkoutDto } from './dto/user-workout.dto';
import { UserWorkout } from './user-workout.entity';

@Injectable()
export class UserWorkoutsService {
  constructor(
    @Inject(USER_WORKOUT_REPOSITORY)
    private readonly userWorkoutRepository: typeof UserWorkout,
  ) {}

  async createUserWorkout(
    data: UserWorkoutDto,
    fullprogworkoutId: number,
    userId: number,
    userappId: number,
  ): Promise<UserWorkout> {
    // iterate and create workouts
    const { dayDone, workoutList } = data;

    return await this.userWorkoutRepository.create<UserWorkout>({
      dayDone,
      workoutList,
      fullprogworkoutId,
      userId,
      userappId,
    });
  }
}
