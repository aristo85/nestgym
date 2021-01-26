import { USER_WORKOUT_REPOSITORY } from "src/core/constants";
import { UserWorkout } from "./user-workout.entity";

export const userWorkoutProviders = [{
    provide: USER_WORKOUT_REPOSITORY,
    useValue: UserWorkout,
}];