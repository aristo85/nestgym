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

  async create(
    prog: WorkoutProgramDto,
    fullprogworkoutId,
  ): Promise<WorkoutProgram> {
    return await this.workoutProgramRepository.create<WorkoutProgram>({
      ...prog,
      fullprogworkoutId,
    });
  }
}
