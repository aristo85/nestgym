import { TEMPLATE_WORKOUT_REPOSITORY } from "src/core/constants";
import { TemplateWorkout } from "./template-workout.entity";

export const templateWorkoutsProviders = [{
    provide: TEMPLATE_WORKOUT_REPOSITORY,
    useValue: TemplateWorkout,
}];