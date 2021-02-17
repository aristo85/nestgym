import { Injectable, Inject } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';
import { ProfileDto, ProfileUpdateDto } from './dto/profile.dto';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
    private readonly photoService: PhotosService,
  ) {}

  async create(profile: ProfileDto, userId): Promise<Profile> {
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

  async findAll(user): Promise<Profile[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list = await this.profileRepository.findAll<Profile>({
      where: updateOPtion,
      include: [...includePhotoOptions],
    });

    return list;
  }

  async findOne(id, user): Promise<Profile> {
    // check the role
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    const prof = await this.profileRepository.findOne({
      where: updateOPtion,
      include: [...includePhotoOptions],
    });
    return prof;
  }

  async findMyProfile(userId): Promise<Profile> {
    const prof = await this.profileRepository.findOne({
      where: { userId },
      include: [...includePhotoOptions],
    });
    return prof;
  }

  async update(id: number, profile: ProfileUpdateDto, userId: number) {
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

  async deleteProfile(id, user) {
    // TODO: remove foreignkey photos
    // find all profile photos

    // delete profile with this id
    return await this.profileRepository.destroy({
      where: { id, userId: user.id },
    });
  }
}
