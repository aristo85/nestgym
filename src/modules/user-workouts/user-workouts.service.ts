import { Inject, Injectable } from '@nestjs/common';
import { where } from 'sequelize';
import { USER_WORKOUT_REPOSITORY } from 'src/core/constants';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { UserWorkoutDto } from './dto/user-workout.dto';
import { UserWorkout } from './user-workout.entity';

@Injectable()
export class UserWorkoutsService {
  constructor(
    @Inject(USER_WORKOUT_REPOSITORY)
    private readonly userWorkoutRepository: typeof UserWorkout,
  ) {}

  async create(
    data: UserWorkoutDto,
    // workoutprogramId,
    fullprogworkoutId,
    user,
    userappId,
  ): Promise<any> {
    // iterate and create workouts
    const { dayDone, workoutList } = data;
    for (const workout of workoutList) {
      await this.userWorkoutRepository.create<UserWorkout>({
        weight: workout.weight,
        dayDone,
        workoutprogramId: workout.id,
        fullprogworkoutId,
        userId: user.id,
        userappId,
      });
    }

    return await FullProgWorkout.findOne({
      where: { id: fullprogworkoutId },
      include: [{ model: WorkoutProgram, include: [UserWorkout] }],
    });
  }

  //   async findAll(user, fullprogworkoutId): Promise<UserWorkout[]> {
  //     // check if from admin
  //     let updateOPtion =
  //       user.role === 'admin' ? {} : { userId: user.id, fullprogworkoutId };

  //     const list = await this.userWorkoutRepository.findAll<UserWorkout>({
  //       where: updateOPtion,
  //     });
  //     return list;
  //   }

  // async update(id, data) {
  //   const [
  //     numberOfAffectedRows,
  //     [updatedworkout],
  //   ] = await this.userWorkoutRepository.update(
  //     { ...data },
  //     { where: { id }, returning: true },
  //   );

  //   return { numberOfAffectedRows, updatedworkout };
  // }

  //   async findOne(id, user): Promise<Userapp> {
  //     // check the role
  //     let updateOPtion = user.role === 'user' ? { id, userId: user.id } : { id };
  //     return await this.userappRepository.findOne({
  //       where: updateOPtion,
  //     });
  //   }
}
