import { DIET_PROGRAM_REPOSITORY } from "src/core/constants";
import { DietProgram } from "./dietprogram.entity";

export const dietProgramProviders = [{
    provide: DIET_PROGRAM_REPOSITORY,
    useValue: DietProgram,
}];