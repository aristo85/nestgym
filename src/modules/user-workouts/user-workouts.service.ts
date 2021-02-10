import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op, where } from 'sequelize';
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
      // check workouts id and day numbers
      const checkRecord = await WorkoutProgram.findOne({
        where: {
          id: workout.id,
          fullprogworkoutId,
          dayNumber: dayDone,
        },
      });
      if (!checkRecord) {
        throw new NotFoundException('wrong workout Id/s or number of day');
      } else {
        // throw new NotFoundException('wrong workout Id/s or number of day');
      }
      // check if today any record been made
      const today: any = new Date();
      const workoutsToday = await UserWorkout.findOne({
        where: {
          fullprogworkoutId,
          workoutprogramId: workout.id,
          dayDone,
          createdAt: {
            [Op.gt]: new Date(today - 24 * 60 * 60 * 1000),
          },
        },
      });
      // create or update based on the records
      if (workoutsToday) {
        await this.userWorkoutRepository.update(
          { weight: workout.weight },
          { where: { id: workoutsToday.id } },
        );
      } else {
        await this.userWorkoutRepository.create<UserWorkout>({
          weight: workout.weight,
          dayDone,
          workoutprogramId: workout.id,
          fullprogworkoutId,
          userId: user.id,
          userappId,
        });
      }
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
