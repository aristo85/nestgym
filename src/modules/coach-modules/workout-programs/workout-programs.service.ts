import { Inject, Injectable } from '@nestjs/common';
import { WORKOUT_PROGRAM_REPOSITORY } from 'src/core/constants';
import { WorkoutProgramDto } from './dto/workout-progiam.dto';
import { WorkoutProgram } from './workout-program.entity';

@Injectable()
export class WorkoutProgramsService {
  constructor(
    @Inject(WORKOUT_PROGRAM_REPOSITORY)
    private readonly workoutProgramRepository: typeof WorkoutProgram,
  ) {}

  async createWorkouts(
    prog: WorkoutProgramDto,
    templateOrFullprogId: number,
    template = '',
  ): Promise<WorkoutProgram> {
    // if creation from full program or template
    let options =
      template === 'template'
        ? { ...prog, templateworkoutId: templateOrFullprogId }
        : { ...prog, fullprogworkoutId: templateOrFullprogId };
    return await this.workoutProgramRepository.create<WorkoutProgram>({
      ...options,
    });
  }

  // async delete(id) {
  //   return await this.workoutProgramRepository.destroy({ where: { id } });
  // }

  async findAll(): Promise<WorkoutProgram[]> {
    // check if from admin
    // let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };
    // // if call from full program or template
    // let options =
    //   template === 'template'
    //     ? { ...prog, templateworkoutId: templateOrFullprog }
    //     : { ...prog, fullprogworkoutId: templateOrFullprog };

    const list = await this.workoutProgramRepository.findAll<WorkoutProgram>(
      {},
    );
    return list;
  }
}
