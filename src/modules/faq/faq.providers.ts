import { FAQ_REPOSITORY } from 'src/core/constants';
import { FAQ } from './faq.entity';

export const faqsProviders = [
  {
    provide: FAQ_REPOSITORY,
    useValue: FAQ,
  },
];
