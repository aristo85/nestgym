import { Inject, Injectable } from '@nestjs/common';
import { TEMPLATE_WORKOUT_REPOSITORY } from 'src/core/constants';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';
import { WorkoutProgramsService } from '../workout-programs/workout-programs.service';
import {
  TemplateWorkoutDto,
  TemplateWorkoutUpdateDto,
} from './dto/template-workout.dto';
import { TemplateWorkout } from './template-workout.entity';

@Injectable()
export class TemplateWorkoutsService {
  constructor(
    @Inject(TEMPLATE_WORKOUT_REPOSITORY)
    private readonly templateworkoutRepository: typeof TemplateWorkout,
    private readonly workoutProgramService: WorkoutProgramsService,
  ) {}

  async createWorkoutTemplate(
    data: TemplateWorkoutDto,
    userId: number,
  ): Promise<any> {
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
      const newProg = await this.workoutProgramService.createWorkouts(
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
      // include: [WorkoutProgram],
    });
    // return { fullProg, programs: listProgs };
  }

  async findAllWorkoutTemplates(
    coachId: number,
    role: string,
  ): Promise<TemplateWorkout[]> {
    // check if from admin
    let updateOPtion = role === 'admin' ? {} : { coachId };

    const list = await this.templateworkoutRepository.findAll<TemplateWorkout>({
      where: updateOPtion,
      // include: [WorkoutProgram],
    });
    return list;
  }

  async findOneWorkoutTemplate(
    templateworkoutId: number,
    coachId: number,
    role: string,
  ): Promise<TemplateWorkout> {
    // check the role
    let updateOPtion =
      role === 'admin'
        ? { id: templateworkoutId }
        : { id: templateworkoutId, coachId };
    return await this.templateworkoutRepository.findOne({
      where: updateOPtion,
      // include: [WorkoutProgram],
    });
  }

  async deleteWorkoutTemplate(templateworkoutId: number, coachId: number) {
    return await this.templateworkoutRepository.destroy({
      where: { id: templateworkoutId, coachId },
    });
  }

  async updateWorkoutTemplate(
    templateworkoutId: number,
    data: TemplateWorkoutUpdateDto,
    coachId: number,
    role: string,
  ) {
    let updateOPtion =
      role === 'admin'
        ? { id: templateworkoutId }
        : { id: templateworkoutId, coachId };
    // delete the workouts for this program
    await WorkoutProgram.destroy({ where: { templateworkoutId } });
    // recreate workouts for this program
    const { programs, ...other } = data;
    for (const workout of programs) {
      await this.workoutProgramService.createWorkouts(
        workout,
        templateworkoutId,
        'template',
      );
    }
    // update the program
    await this.templateworkoutRepository.update(
      { ...other },
      { where: updateOPtion, returning: true },
    );
    // return the updated program with workouts
    return await this.templateworkoutRepository.findOne({
      where: {
        id: templateworkoutId,
      },
      // include: [WorkoutProgram],
    });
  }
}
