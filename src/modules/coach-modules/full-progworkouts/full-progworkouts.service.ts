import { Inject, Injectable } from '@nestjs/common';
import { FULL_PROGWORKOUT_REPOSITORY } from 'src/core/constants';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';
import { WorkoutProgramsService } from '../workout-programs/workout-programs.service';
import { FullProgWorkoutDto } from './dto/full-progworkout.dto';
import { FullProgWorkout } from './full.progworkout.enity';

@Injectable()
export class FullProgworkoutsService {
  constructor(
    @Inject(FULL_PROGWORKOUT_REPOSITORY)
    private readonly fullProgworkoutRepository: typeof FullProgWorkout,
    private readonly workoutProgramService: WorkoutProgramsService,
  ) {}

  async create(data: FullProgWorkoutDto, coachId): Promise<any> {
    // creating the  program(full program) in fullprogworkout table
    const { programs, clientIds, ...other } = data;
    for (const client of clientIds) {
      const fullProg = await this.fullProgworkoutRepository.create<FullProgWorkout>(
        {
          ...other,
          coachId,
          userId: client,
        },
      );
      // creating workouts in workoutprogram table
      let listProgs = [];
      for (const workout of data.programs) {
        const newProg = await this.workoutProgramService.create(
          workout,
          fullProg.id,
        );
        listProgs.push(newProg);
      }
    }

    return await this.fullProgworkoutRepository.findAll({
      where: {
        userId: [...clientIds],
        coachId,
      },
      include: [WorkoutProgram],
    });
    // return { fullProg, programs: listProgs };
  }

  async findAll(user): Promise<FullProgWorkout[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list = await this.fullProgworkoutRepository.findAll<FullProgWorkout>({
      where: updateOPtion,
      include: [WorkoutProgram],
    });
    return list;
  }

  async findOne(id, user): Promise<FullProgWorkout> {
    // check the role
    let updateOPtion =
      user.role === 'trainer' ? { id, coachId: user.id } : { id };
    return await this.fullProgworkoutRepository.findOne({
      where: updateOPtion,
      include: [WorkoutProgram],
    });
  }

  async delete(id, coachId) {
    return await this.fullProgworkoutRepository.destroy({
      where: { id, coachId },
    });
  }

  async update(id, data, userId) {
    // delete the products for this program
    await WorkoutProgram.destroy({ where: { fullprogworkoutId: id } });
    // recreate products for this program
    const { programs, ...other } = data;
    for (const product of programs) {
      await this.workoutProgramService.create(product, id);
    }
    // update the program
    await this.fullProgworkoutRepository.update(
      { ...other },
      { where: { id }, returning: true },
    );
    // return the updated program with workouts
    return await this.fullProgworkoutRepository.findOne({
      where: {
        id,
      },
      include: [WorkoutProgram],
    });
  }
}
