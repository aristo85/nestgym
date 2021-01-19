import { Inject, Injectable } from '@nestjs/common';
import { COACH_SERVICE_REPOSITORY } from 'src/core/constants';
import { CoachService } from './coach-service.entity';
import { CoachServiceDto } from './dto/coach-service.dto';

@Injectable()
export class CoachServicesService {
  constructor(
    @Inject(COACH_SERVICE_REPOSITORY)
    private readonly coachServiceRepository: typeof CoachService,
  ) {}

  async create(
    servicelist: CoachServiceDto[],
    userId,
  ): Promise<CoachService[]> {
    let newList = [];
    servicelist.map(async (service) => {
      const newService = await this.coachServiceRepository.create<CoachService>(
        {
          ...service,
          userId,
        },
      );
      newList.push(newService);
    });

    return newList;
  }

  async update(id, data, userId) {
    const [
      numberOfAffectedRows,
      [updatedCoachServices],
    ] = await this.coachServiceRepository.update(
      { ...data },
      { where: { id, userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedCoachServices };
  }
}
