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

  async findAll(user): Promise<Profile[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list = await this.profileRepository.findAll<Profile>({
      where: updateOPtion,
    });
    return list;
  }

  async findOne(id, user): Promise<Profile> {
    // check the role
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    return await this.profileRepository.findOne({
      where: updateOPtion,
    });
  }

  async findMyProfile(userId): Promise<Profile> {
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
