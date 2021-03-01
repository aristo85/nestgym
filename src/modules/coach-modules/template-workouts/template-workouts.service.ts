import { Inject, Injectable } from '@nestjs/common';
import { TEMPLATE_WORKOUT_REPOSITORY } from 'src/core/constants';
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
  ) {}

  async createWorkoutTemplate(
    data: TemplateWorkoutDto,
    coachUserId: number,
  ): Promise<TemplateWorkout> {
    // creating the template program
    return await this.templateworkoutRepository.create<TemplateWorkout>({
      ...data,
      coachId: coachUserId,
    });
  }

  async findAllWorkoutTemplates(
    coachUserId?: number,
  ): Promise<TemplateWorkout[]> {
    let dataOPtions = coachUserId ? { coachId: coachUserId } : {};

    return await this.templateworkoutRepository.findAll<TemplateWorkout>({
      where: dataOPtions,
    });
  }

  async findOneWorkoutTemplate(
    templateworkoutId: number,
    coachUserId?: number,
  ): Promise<TemplateWorkout> {
    let dataOPtions = coachUserId
      ? { id: templateworkoutId, coachId: coachUserId }
      : { id: templateworkoutId };
    return await this.templateworkoutRepository.findOne({
      where: dataOPtions,
    });
  }

  async deleteWorkoutTemplate(templateworkoutId: number, coachUserId?: number) {
    let dataOPtions = coachUserId
      ? { id: templateworkoutId, coachId: coachUserId }
      : { id: templateworkoutId };
    return await this.templateworkoutRepository.destroy({
      where: dataOPtions,
    });
  }

  async updateWorkoutTemplate(
    templateworkoutId: number,
    data: TemplateWorkoutUpdateDto,
    coachUserId?: number,
  ) {
    let updateOPtion = coachUserId
      ? { id: templateworkoutId, coachId: coachUserId }
      : { id: templateworkoutId };
    // update the program
    const [
      affectedRows,
      workoutTemplate,
    ] = await this.templateworkoutRepository.update(
      { ...data },
      { where: updateOPtion, returning: true },
    );
    // return the updated program with workouts
    return workoutTemplate;
  }
}
