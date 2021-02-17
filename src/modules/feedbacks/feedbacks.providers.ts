import { FEEDBACK_REPOSITORY } from "src/core/constants";
import { Feedback } from "./feedback.entity";

export const feedbacksProviders = [{
    provide: FEEDBACK_REPOSITORY,
    useValue: Feedback,
}];