import { PROGRESS_REPOSITORY } from "src/core/constants";
import { UserProgress } from "./user-progress.entity";

export const userProgressProviders = [{
    provide: PROGRESS_REPOSITORY,
    useValue: UserProgress,
}];