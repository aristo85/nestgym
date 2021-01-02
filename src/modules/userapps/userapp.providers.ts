import { APPLICATION_REPOSITORY } from '../../core/constants';
import { Userapp } from './userapp.entity';

export const userappsProviders = [
  {
    provide: APPLICATION_REPOSITORY,
    useValue: Userapp,
  },
];
