import { AIM_REPOSITORY } from "src/core/constants";
import { Aim } from "./aim.entity";

export const aimsProviders = [{
    provide: AIM_REPOSITORY,
    useValue: Aim,
}];