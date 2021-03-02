import { PLACE_REPOSITORY } from 'src/core/constants';
import { Place } from './place.entity';

export const placesProviders = [
  {
    provide: PLACE_REPOSITORY,
    useValue: Place,
  },
];
