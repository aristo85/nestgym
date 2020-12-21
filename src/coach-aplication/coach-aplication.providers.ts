import { CoachApplication } from "./coach-aplication.entity";

export const coachAppProviders = [
  {
    provide: 'COACHAPP_REPOSITORY',
    useValue: CoachApplication,
  },
];
