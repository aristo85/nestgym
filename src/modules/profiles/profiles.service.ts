import { Injectable, Inject } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';
import { ProfileDto, ProfileUpdateDto } from './dto/profile.dto';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
import { User } from '../users/user.entity';
import { photoPositionTypes } from '../photos/dto/photo.dto';

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
      // raw: true,
      // nest: true,
    });
  }

  async findMyClientProfile(userId: number): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { userId },
      include: [...includePhotoOptions],
    });
  }

  async updateClientProfile(
    clientProfileId: number,
    data: ProfileUpdateDto,
    userId: number,
  ) {
    // from the data update
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);
    // before updating
    const beforeUpdate = await this.findOneClientProfile(clientProfileId);

    // update
    const [
      numberOfAffectedRows,
      [updatedProfile],
    ] = await this.profileRepository.update(
      {
        ...data,
        frontPhotoId: frontPhoto?.id,
        sidePhotoId: sidePhoto?.id,
        backPhotoId: backPhoto?.id,
      },
      { where: { id: clientProfileId, userId }, returning: true },
    );
    // if nothing to update
    if (numberOfAffectedRows === 0) {
      return { numberOfAffectedRows, updatedProfile };
    }

    // //remove photos from DB if was last module
    // await this.photoService.checkPhotoPositionsAndDelete(
    //   beforeUpdate.frontPhoto,
    //   beforeUpdate.sidePhoto,
    //   beforeUpdate.backPhoto,
    // );

    return { numberOfAffectedRows, updatedProfile };
  }

  async deleteClientProfile(clientProfileId: number, user: User) {
    // find all photos in profile
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.findOneClientProfile(clientProfileId);

    // delete profile with this id
    const deleted = await this.profileRepository.destroy({
      where: { id: clientProfileId, userId: user.id },
    });
    // if nothing to delete
    if (deleted === 0) {
      return deleted;
    }

    // //remove photos from DB if was last module
    // await this.photoService.checkPhotoPositionsAndDelete(
    //   frontPhoto,
    //   sidePhoto,
    //   backPhoto,
    // );

    return deleted;
  }

  // set current userapp
  async setCurrentUserapp(
    profileId: number,
    currentUserappId: number,
    userId: number,
  ) {
    const [
      numberOfAffectedRows,
      [updatedProfile],
    ] = await this.profileRepository.update(
      { currentUserappId: currentUserappId },
      { where: { id: profileId, userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedProfile };
  }

  async deleteProfilePhoto(
    profileId: number,
    photoPosition: photoPositionTypes,
    photoId: number,
    photoFileName: string,
    userId,
  ) {
    const updateOptions =
      photoPosition === 'front'
        ? { frontPhotoId: null }
        : photoPosition === 'side'
        ? { sidePhotoId: null }
        : { backPhotoId: null };
    // update profile
    await this.profileRepository.update(updateOptions, {
      where: { id: profileId, userId },
    });

    // delete the photo with this id
    const deleted = await this.photoService.deletePhoto(photoId, photoFileName);
    return deleted;
  }

  async findProfileByPhotoPosition(
    profileId,
    photoPosition: string,
    photoId: number,
    userId: number,
  ) {
    const dataOptions =
      photoPosition === 'front'
        ? { frontPhotoId: photoId }
        : photoPosition === 'side'
        ? { sidePhotoId: photoId }
        : { backPhotoId: photoId };
    return await this.profileRepository.findOne({
      where: { ...dataOptions, userId, id: profileId },
    });
  }
}
