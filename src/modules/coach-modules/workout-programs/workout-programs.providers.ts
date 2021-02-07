import { WORKOUT_PROGRAM_REPOSITORY } from "src/core/constants";
import { WorkoutProgram } from "./workout-program.entity";

export const workoutProgramsProviders = [{
    provide: WORKOUT_PROGRAM_REPOSITORY,
    useValue: WorkoutProgram,
}];