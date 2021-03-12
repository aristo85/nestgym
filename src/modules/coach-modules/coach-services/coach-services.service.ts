import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { COACH_SERVICE_REPOSITORY } from 'src/core/constants';
import { User } from 'src/modules/users/user.entity';
import { CoachService } from './coach-service.entity';
import { CoachServiceDto } from './dto/coach-service.dto';

@Injectable()
export class CoachServicesService {
  constructor(
    @Inject(COACH_SERVICE_REPOSITORY)
    private readonly coachServiceRepository: typeof CoachService,
  ) {}

  async updateCoachService(
    coachServiceId: number,
    data: CoachServiceDto,
    user: User,
  ) {
    if (user.role !== 'admin') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const [
      numberOfAffectedRows,
      [updatedCoachServices],
    ] = await this.coachServiceRepository.update(
      { ...data },
      { where: { id: coachServiceId }, returning: true },
    );

    return { numberOfAffectedRows, updatedCoachServices };
  }

  async updateMany(
    coachProfileId: number | undefined,
    data: CoachServiceDto[],
  ) {
    const updateOption = { coachProfileId };

    // Remove existing
    this.coachServiceRepository.destroy({ where: updateOption });

    // Adding new
    const coachServices = this.coachServiceRepository.bulkCreate(
      data.map((service) => ({
        ...service,
        coachProfileId: updateOption.coachProfileId,
      })),
      { returning: true },
    );

    return { coachServices };
  }
}
