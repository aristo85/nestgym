import { User } from './user.entity';
// import { USER_REPOSITORY } from '../utils/constants';

console.log(process.env.ARIS)

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];