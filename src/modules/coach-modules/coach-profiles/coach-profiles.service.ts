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

  async findOne(userId): Promise<CoachProfile> {
    // const test = await Requsetedapp.findOne({include: [Userapp]})
    // console.log(test)
    // test.userapps.forEach(userapp => console.log(`userapp ${userapp.aim}`));

    return await this.coachProfileRepository.findOne({
      where: { userId },
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
  async findAll(): Promise<CoachProfile[]> {
    const list = await this.coachProfileRepository.findAll<CoachProfile>({});
    // const count = await this.coachProfileRepository.count();
    // console.log(count);
    return list;
  }
}
