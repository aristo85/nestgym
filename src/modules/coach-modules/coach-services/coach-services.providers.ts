import { COACH_SERVICE_REPOSITORY } from "src/core/constants";
import { CoachService } from "./coach-service.entity";

export const coachServisesProviders = [{
    provide: COACH_SERVICE_REPOSITORY,
    useValue: CoachService,
}];