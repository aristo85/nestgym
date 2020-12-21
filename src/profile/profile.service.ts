import { Inject, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('PROFILE_REPOSITORY')
    private readonly profileRepository: typeof Profile,
  ) {}

  async getAllProfiles(): Promise<Profile[]> {
    return await this.profileRepository.findAll<Profile>();
  }

  // async createProfile(createProfile: CreateProfileDto): Promise<Profile> {
  //   return await this.profileRepository.create<Profile>(createProfile);
  // }
}
