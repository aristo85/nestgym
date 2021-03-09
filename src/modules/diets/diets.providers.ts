import { DIET_REPOSITORY } from 'src/core/constants';
import { Diet } from './diet.entity';

export const dietsProviders = [
  {
    provide: DIET_REPOSITORY,
    useValue: Diet,
  },
];
