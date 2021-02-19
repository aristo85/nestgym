import { Inject, Injectable } from '@nestjs/common';
import { FULL_PROGWORKOUT_REPOSITORY } from 'src/core/constants';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Requestedapp } from '../coachapps/coachapp.entity';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';
import { WorkoutProgramsService } from '../workout-programs/workout-programs.service';
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
    private readonly workoutProgramService: WorkoutProgramsService,
  ) {}

  async createFullProgWorkout(
    data: FullProgWorkoutDto,
    coachId: number,
    myRequests: Requestedapp[],
  ): Promise<any> {
    // creating the  program(full program) in fullprogworkout table
    const { programs, userappIds, ...other } = data;
    for (const appRequest of myRequests) {
      const fullProg = await this.fullProgworkoutRepository.create<FullProgWorkout>(
        {
          ...other,
          coachId,
          userappId: appRequest.userappId,
          userId: appRequest.userId,
        },
      );
      // creating workouts in workoutprogram table
      for (const workout of programs) {
        await this.workoutProgramService.createWorkouts(workout, fullProg.id);
      }
    }

    return await this.fullProgworkoutRepository.findAll({
      where: {
        userappId: [...userappIds],
        coachId,
      },
      include: [WorkoutProgram],
    });
  }

  async findAllFullProgWorkouts(
    coachId: number,
    role: string,
  ): Promise<FullProgWorkout[]> {
    // check if from admin
    let updateOPtion = role === 'admin' ? {} : { coachId };

    const list = await this.fullProgworkoutRepository.findAll<FullProgWorkout>({
      where: updateOPtion,
      include: [WorkoutProgram],
    });
    return list;
  }

  async findOneFullProgWorkout(
    fullprogworkoutId: number,
    coachId: number,
    role: string,
  ): Promise<FullProgWorkout> {
    // check the role
    let updateOPtion =
      role === 'admin'
        ? { id: fullprogworkoutId }
        : { id: fullprogworkoutId, coachId };
    return await this.fullProgworkoutRepository.findOne({
      where: updateOPtion,
      include: [{ model: WorkoutProgram, include: [UserWorkout] }],
    });
  }

  async deleteFullProgWorkout(fullprogworkoutId: number, coachId: number) {
    return await this.fullProgworkoutRepository.destroy({
      where: { id: fullprogworkoutId, coachId },
    });
  }

  async updateFullProgWorkout(
    fullprogworkoutId: number,
    data: FullProgWorkoutUpdateDto,
    userId: number,
  ) {
    // delete the workout-programs for this program
    await WorkoutProgram.destroy({ where: { fullprogworkoutId } });
    // delete user records too
    await UserWorkout.destroy({ where: { fullprogworkoutId } });
    // recreate products for this program
    const { programs, ...other } = data;
    for (const product of programs) {
      await this.workoutProgramService.createWorkouts(
        product,
        fullprogworkoutId,
      );
    }
    // update the program
    await this.fullProgworkoutRepository.update(
      { ...other },
      { where: { id: fullprogworkoutId }, returning: true },
    );
    // return the updated program with workouts
    return await this.fullProgworkoutRepository.findOne({
      where: {
        id: fullprogworkoutId,
      },
      include: [WorkoutProgram],
    });
  }
}
