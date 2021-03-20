import { TRANSACTION_REPOSITORY } from 'src/core/constants';
import { AppPayment } from './appPaymetn.entity';

export const transactionsProviders = [
  {
    provide: TRANSACTION_REPOSITORY,
    useValue: AppPayment,
  },
];
