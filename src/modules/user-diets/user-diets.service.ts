import { Injectable } from '@nestjs/common';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';

export type RetDiet = DietProgram | {
  coachProfile: any;
};

@Injectable()
export class UserDietsService {}
