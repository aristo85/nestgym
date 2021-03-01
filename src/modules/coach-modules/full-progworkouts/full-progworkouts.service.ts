import { Inject, Injectable } from '@nestjs/common';
import { FULL_PROGWORKOUT_REPOSITORY } from 'src/core/constants';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import {
  FullProgWorkoutDto,
  FullProgWorkoutUpdateDto,
} from './dto/full-progworkout.dto';
import { FullProgWorkout } from './full.progworkout.enity';

@Injectable()
export class FullProgworkoutsService {
  constructor(
    @Inject(FULL_PROGWORKOUT_REPOSITORY)
    private readonly fullProgworkoutRepository: typeof FullProgWorkout,
  ) {}

  async createFullProgWorkout(
    data: FullProgWorkoutDto,
    coachId: number,
    userapps: Userapp[],
  ): Promise<FullProgWorkout[]> {
    // creating the  program(full program) in fullprogworkout table
    const { workoutProgram, userappIds, ...other } = data;

    return await this.fullProgworkoutRepository.bulkCreate<FullProgWorkout>(
      userapps.map(
        (userapp) => ({
          ...other,
          coachId,
          userappId: userapp.id,
          userId: userapp.userId,
          workoutProgram,
        }),
        { returning: true },
      ),
    );
  }

  async findAllFullProgWorkouts(
    coachUserId: number,
    role: string,
  ): Promise<FullProgWorkout[]> {
    // check if from admin
    // let updateOPtion = role === 'admin' ? {} : { coachId };

    const list = await this.fullProgworkoutRepository.findAll<FullProgWorkout>({
      where: { coachId: coachUserId },
      // include: [WorkoutProgram],
    });
    return list;
  }

  async findOneFullProgWorkout(
    fullprogworkoutId: number,
    coachUserId: number,
    role: string,
  ): Promise<FullProgWorkout> {
    // check the role
    // let updateOPtion =
    // role === 'admin'
    //   ? { id: fullprogworkoutId }
    //   : { id: fullprogworkoutId, coachId: coachUserId };
    return await this.fullProgworkoutRepository.findOne({
      where: { id: fullprogworkoutId, coachId: coachUserId },
      include: [UserWorkout],
    });
  }

  async deleteFullProgWorkout(fullprogworkoutId: number, coachUserId: number) {
    return await this.fullProgworkoutRepository.destroy({
      where: { id: fullprogworkoutId, coachId: coachUserId },
    });
  }

  async updateFullProgWorkout(
    fullprogworkoutId: number,
    data: FullProgWorkoutUpdateDto,
    coachUserId: number,
  ) {
    // // delete the workout-programs for this program
    // await WorkoutProgram.destroy({ where: { fullprogworkoutId } });
    // // delete user records too
    // await UserWorkout.destroy({ where: { fullprogworkoutId } });
    // // recreate products for this program
    const { workoutProgram, ...other } = data;
    // for (const product of programs) {
    //   await this.workoutProgramService.createWorkouts(
    //     product,
    //     fullprogworkoutId,
    //   );
    // }
    // update the program
    const [
      affectedRows,
      workouts,
    ] = await this.fullProgworkoutRepository.update(
      { ...other, workoutProgram },
      {
        where: { id: fullprogworkoutId, coachId: coachUserId },
        returning: true,
      },
    );
    // return the updated program with workouts
    return workouts;
  }
}
