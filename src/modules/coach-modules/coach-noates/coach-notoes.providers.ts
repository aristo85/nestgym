import { COACH_NOTE_REPOSITORY } from 'src/core/constants';
import { CoachNote } from './coachNote.entity';

export const coachNotesProviders = [
  {
    provide: COACH_NOTE_REPOSITORY,
    useValue: CoachNote,
  },
];
