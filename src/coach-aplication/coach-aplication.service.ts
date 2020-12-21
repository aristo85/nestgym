import { Inject, Injectable } from '@nestjs/common';
import { CoachApplication } from './coach-aplication.entity';

@Injectable()
export class CoachAplicationService {
    constructor(
        @Inject('COACHAPP_REPOSITORY')
        private readonly coachRepository: typeof CoachApplication,
      ) {}

      async getAllCoachApps(): Promise<CoachApplication[]> {
        return await this.coachRepository.findAll<CoachApplication>();
      }
}
