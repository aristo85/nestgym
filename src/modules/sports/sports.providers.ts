import { SPORT_REPOSITORY } from 'src/core/constants';
import { Sport } from './sport.entity';

export const sportsProviders = [
  {
    provide: SPORT_REPOSITORY,
    useValue: Sport,
  },
];
