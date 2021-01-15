import { Inject, Injectable } from '@nestjs/common';
import { COACH_APP_REPOSITORY } from 'src/core/constants';
import { Requestedapp } from './coachapp.entity';

@Injectable()
export class CoachappsService {
    constructor(
        @Inject(COACH_APP_REPOSITORY)
        private readonly coachappRepository: typeof Requestedapp,
      ) {}

      async create(userId, coachId, userappId): Promise<Requestedapp> {
        return await this.coachappRepository.create<Requestedapp>({
          userId,
          coachId,
          userappId,
          status: 'pending',
        });
      }

      async findOne(userappId): Promise<Requestedapp> {
        return await this.coachappRepository.findOne({
          where: { userappId },
        });
      }
}
