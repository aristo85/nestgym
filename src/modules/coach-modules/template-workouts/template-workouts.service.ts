import { Inject, Injectable } from '@nestjs/common';
import { TEMPLATE_WORKOUT_REPOSITORY } from 'src/core/constants';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';
import { WorkoutProgramsService } from '../workout-programs/workout-programs.service';
import { TemplateWorkoutDto } from './dto/template-workout.dto';
import { TemplateWorkout } from './template-workout.entity';

@Injectable()
export class TemplateWorkoutsService {
  constructor(
    @Inject(TEMPLATE_WORKOUT_REPOSITORY)
    private readonly templateworkoutRepository: typeof TemplateWorkout,
    private readonly workoutProgramService: WorkoutProgramsService,
  ) {}

  async create(data: TemplateWorkoutDto, userId): Promise<any> {
    // creating the template program
    const { programs, ...other } = data;
    const template = await this.templateworkoutRepository.create<TemplateWorkout>(
      {
        ...other,
        coachId: userId,
      },
    );
    // creating workouts in workoutprogram table
    let listProgs = [];
    for (const workout of data.programs) {
      const newProg = await this.workoutProgramService.create(
        workout,
        template.id,
        'template',
      );
      listProgs.push(newProg);
    }

    return await this.templateworkoutRepository.findOne({
      where: {
        id: template.id,
      },
      include: [WorkoutProgram],
    });
    // return { fullProg, programs: listProgs };
  }

  async findAll(user): Promise<TemplateWorkout[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list = await this.templateworkoutRepository.findAll<TemplateWorkout>({
      where: updateOPtion,
      include: [WorkoutProgram],
    });
    return list;
  }

  async findOne(id, user): Promise<TemplateWorkout> {
    // check the role
    let updateOPtion =
      user.role === 'admin' ? { id } : { id, coachId: user.id };
    return await this.templateworkoutRepository.findOne({
      where: updateOPtion,
      include: [WorkoutProgram],
    });
  }

  async delete(id, coachId) {
    return await this.templateworkoutRepository.destroy({
      where: { id, coachId },
    });
  }

  async update(id, data, user) {
    let updateOPtion = user.role === 'admin' ? { id } : { id, coachId: user.id };
    // delete the workouts for this program
    await WorkoutProgram.destroy({ where: { templateworkoutId: id } });
    // recreate workouts for this program
    const { programs, ...other } = data;
    for (const workout of programs) {
      await this.workoutProgramService.create(workout, id, 'template');
    }
    // update the program
    await this.templateworkoutRepository.update(
      { ...other },
      { where: updateOPtion, returning: true },
    );
    // return the updated program with workouts
    return await this.templateworkoutRepository.findOne({
      where: {
        id,
      },
      include: [WorkoutProgram],
    });
  }
}
