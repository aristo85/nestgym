import { Injectable, Inject } from '@nestjs/common';
import { COATCH_PROFILE_REPOSITORY } from 'src/core/constants';
import { CoachService } from '../coach-services/coach-service.entity';
import { CoachServicesService } from '../coach-services/coach-services.service';
import { CoachProfile } from './coach-profile.entity';
import { CoachProfileDto } from './dto/coach-profile.dto';

@Injectable()
export class CoachProfilesService {
  constructor(
    @Inject(COATCH_PROFILE_REPOSITORY)
    private readonly coachProfileRepository: typeof CoachProfile,
    private readonly coachServiceService: CoachServicesService,
  ) {}

  async create(data: CoachProfileDto, userId): Promise<any> {
    // create coach services DB
    const services = await this.coachServiceService.create(
      data.coachServices,
      userId,
    );
    // omit the coachservices prop and create profile
    const { coachServices, ...other } = data;
    const profile = await this.coachProfileRepository.create<CoachProfile>({
      ...other,
      userId,
    });

    return { profile, services };
  }

  async findOne(user, id): Promise<any> {
    // check role
    let whereOptions =
      user.role === 'trainer' ? { id, userId: user.id } : { id };
    // return coach services with the profile
    const serviceList = await CoachService.findAll({
      where: { userId: user.id },
    });

    const profile = await this.coachProfileRepository.findOne({
      where: whereOptions,
    });

    return { profile, serviceList };
  }

  async delete(id, userId) {
    // delete also the coach services
    await CoachService.destroy({ where: { userId } });
    return await this.coachProfileRepository.destroy({ where: { id, userId } });
  }


  async update(id, data, userId) {
    const [
      numberOfAffectedRows,
      [updatedprofile],
    ] = await this.coachProfileRepository.update(
      { ...data },
      { where: { id, userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedprofile };
  }

  // exported
  async findAll(user): Promise<CoachProfile[]> {
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list = await this.coachProfileRepository.findAll<CoachProfile>({
      where: updateOPtion,
    });
    // const count = await this.coachProfileRepository.count();
    return list;
  }
}
