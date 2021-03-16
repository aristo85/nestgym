import { User } from './user.entity';
import {
  FORGOT_PASSWORD_FEEDBACK_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constants';
import { ForgotPassword } from './forgotPassword.entity';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: FORGOT_PASSWORD_FEEDBACK_REPOSITORY,
    useValue: ForgotPassword,
  },
];
