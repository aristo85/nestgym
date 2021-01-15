import { COACH_APP_REPOSITORY } from 'src/core/constants';
import { Requestedapp } from './coachapp.entity';

export const coachappsProviders = [
  {
    provide: COACH_APP_REPOSITORY,
    useValue: Requestedapp,
  },
];
