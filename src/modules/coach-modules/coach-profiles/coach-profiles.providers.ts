import { COATCH_PROFILE_REPOSITORY } from "src/core/constants";
import { CoachProfile } from "./coach-profile.entity";

export const coachProfilesProviders = [{
    provide: COATCH_PROFILE_REPOSITORY,
    useValue: CoachProfile,
}];