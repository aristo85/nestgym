import { REQUESTED_APP_REPOSITORY } from 'src/core/constants';
import { Requsetedapp } from './requestedapp.entity';

export const requestedappsProviders = [
  {
    provide: REQUESTED_APP_REPOSITORY,
    useValue: Requsetedapp,
  },
];
