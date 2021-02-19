import { Injectable, Inject } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';
import { ProfileDto, ProfileUpdateDto } from './dto/profile.dto';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
import { User } from '../users/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
    private readonly photoService: PhotosService,
  ) {}

  async createClientProfile(
    profile: ProfileDto,
    userId: number,
  ): Promise<Profile> {
    // photos
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(profile);

    // create profile first
    const newProfile = (
      await this.profileRepository.create<Profile>({
        ...profile,
        frontPhotoId: frontPhoto?.id,
        sidePhotoId: sidePhoto?.id,
        backPhotoId: backPhoto?.id,
        userId,
      })
    ).get({ plain: true });

    return newProfile as Profile;
  }

  async findAllClientProfiles(): Promise<Profile[]> {
    return await this.profileRepository.findAll<Profile>({
      include: [...includePhotoOptions],
    });
  }

  async findOneClientProfile(clientProfileId: number): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { id: clientProfileId },
      include: [...includePhotoOptions],
    });
  }

  async findMyClientProfile(userId: number): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { userId },
      include: [...includePhotoOptions],
    });
  }

  async updateClientProfile(
    id: number,
    profile: ProfileUpdateDto,
    userId: number,
  ) {
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(profile);

    const [
      numberOfAffectedRows,
      [updatedProfile],
    ] = await this.profileRepository.update(
      {
        ...profile,
        frontPhotoId: frontPhoto?.id,
        sidePhotoId: sidePhoto?.id,
        backPhotoId: backPhoto?.id,
      },
      { where: { id, userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedProfile };
  }

  async deleteClientProfile(clientProfileId: number, user: User) {
    // TODO: remove foreignkey photos
    // find all profile photos

    // delete profile with this id
    return await this.profileRepository.destroy({
      where: { id: clientProfileId, userId: user.id },
    });
  }
}
