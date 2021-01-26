import { Inject, Injectable } from '@nestjs/common';
import { USER_WORKOUT_REPOSITORY } from 'src/core/constants';
import { UserWorkoutDto } from './dto/user-workout.dto';
import { UserWorkout } from './user-workout.entity';

@Injectable()
export class UserWorkoutsService {
  constructor(
    @Inject(USER_WORKOUT_REPOSITORY)
    private readonly userWorkoutRepository: typeof UserWorkout,
  ) {}

  async create(
    lastWeight: UserWorkoutDto,
    workoutprogramId,
    fullprogworkoutId,
    userId,
  ): Promise<any> {
    const myWorkout = await this.userWorkoutRepository.create<UserWorkout>({
      ...lastWeight,
      workoutprogramId,
      fullprogworkoutId,
      userId,
    });

    return myWorkout;
  }

    async findAll(user, fullprogworkoutId): Promise<UserWorkout[]> {
      // check if from admin
      let updateOPtion =
        user.role === 'admin' ? {} : { userId: user.id, fullprogworkoutId };

      const list = await this.userWorkoutRepository.findAll<UserWorkout>({
        where: updateOPtion,
      });
      return list;
    }

  async update(id, data) {
    const [
      numberOfAffectedRows,
      [updatedworkout],
    ] = await this.userWorkoutRepository.update(
      { ...data },
      { where: { id }, returning: true },
    );

    return { numberOfAffectedRows, updatedworkout };
  }

  //   async findOne(id, user): Promise<Userapp> {
  //     // check the role
  //     let updateOPtion = user.role === 'user' ? { id, userId: user.id } : { id };
  //     return await this.userappRepository.findOne({
  //       where: updateOPtion,
  //     });
  //   }
}
