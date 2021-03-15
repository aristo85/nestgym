import { G_C_FEEDBACK_REPOSITORY } from 'src/core/constants';
import { GCFeedback } from './get-caoch-feedback.entity';

export const GCFeedbacksProviders = [
  {
    provide: G_C_FEEDBACK_REPOSITORY,
    useValue: GCFeedback,
  },
];
