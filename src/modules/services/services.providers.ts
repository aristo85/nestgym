import { SERVICE_REPOSITORY } from 'src/core/constants';
import { Servicio } from './service.entity';

export const servicesProviders = [
  {
    provide: SERVICE_REPOSITORY,
    useValue: Servicio,
  },
];
