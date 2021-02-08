import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { PhotosService } from '../photos/photos.service';
import { Photo } from '../photos/photo.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
    private readonly photoService: PhotosService,
  ) {}

  async create(profile: ProfileDto, userId): Promise<Profile> {
    // create profile first
    const { photos, ...others } = profile;
    const newProfile = await this.profileRepository.create<Profile>({
      ...others,
      userId,
    });
    // create photos
    await this.photoService.create({ photo: photos }, userId, {
      profileId: newProfile.id,
    });
    // return created profile with photos
    return await Profile.findOne({
      where: { id: newProfile.id },
      include: [Photo],
    });
  }

  async findAll(user): Promise<Profile[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list = await this.profileRepository.findAll<Profile>({
      where: updateOPtion,
      include: [Photo],
    });
    return list;
  }

  async findOne(id, user): Promise<Profile> {
    // check the role
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    return await this.profileRepository.findOne({
      where: updateOPtion,
      include: [Photo],
    });
  }

  async findMyProfile(userId): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { userId },
      include: [Photo],
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

  async addPhoto(data, userId, sourceId) {
    return this.photoService.create(data, userId, sourceId);
  }

  async deletePhoto(id, userId, name) {
    const checkOtherIds = {
      progressId: null,
      userappId: null,
      feedbackId: null,
    };
    const updateSourceId = { profileId: null };
    return await this.photoService.delete(
      id,
      userId,
      name,
      checkOtherIds,
      updateSourceId,
    );
  }
}
