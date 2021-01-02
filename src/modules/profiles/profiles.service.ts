import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
  ) {}

  async create(profile: ProfileDto, userId): Promise<Profile> {
    return await this.profileRepository.create<Profile>({ ...profile, userId });
  }

  async findOne(userId): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { userId },
    });
  }

  async update(id, data, userId) {
    const [
      numberOfAffectedRows,
      [updatedProfile],
    ] = await this.profileRepository.update(
      { ...data },
      { where: { id, userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedProfile };
  }
}
