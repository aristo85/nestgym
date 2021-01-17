import { Injectable, Inject } from '@nestjs/common';
import { COATCH_PROFILE_REPOSITORY } from 'src/core/constants';
import { CoachProfile } from './coach-profile.entity';
import { CoachProfileDto } from './dto/coach-profile.dto';

@Injectable()
export class CoachProfilesService {
  constructor(
    @Inject(COATCH_PROFILE_REPOSITORY)
    private readonly coachProfileRepository: typeof CoachProfile,
  ) {}

  async create(profile: CoachProfileDto, userId): Promise<CoachProfile> {
    return await this.coachProfileRepository.create<CoachProfile>({
      ...profile,
      userId,
    });
  }

  async findOne(user, id): Promise<CoachProfile> {
    // check role
    let whereOptions = user.role === 'trainer' ? { id, userId: user.id } : { id };

    return await this.coachProfileRepository.findOne({
      where: whereOptions,
    });
  }

  async delete(id, userId) {
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
    // console.log(count);
    return list;
  }
}
