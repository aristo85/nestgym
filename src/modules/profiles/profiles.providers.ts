import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';

export const profilesProviders = [
  {
    provide: PROFILE_REPOSITORY,
    useValue: Profile,
  },
];
