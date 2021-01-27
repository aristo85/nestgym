import { TEMPLATE_DIET_REPOSITORY } from "src/core/constants";
import { TemplateDiet } from "./template-diet.entity";

export const templateDietsProviders = [{
    provide: TEMPLATE_DIET_REPOSITORY,
    useValue: TemplateDiet,
}];