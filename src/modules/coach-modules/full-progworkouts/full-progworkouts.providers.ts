import { FULL_PROGWORKOUT_REPOSITORY } from "src/core/constants";
import { FullProgWorkout } from "./full.progworkout.enity";

export const fullProgworkoutsProviders = [{
    provide: FULL_PROGWORKOUT_REPOSITORY,
    useValue: FullProgWorkout,
}];