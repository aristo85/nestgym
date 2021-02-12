import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PROFILE_REPOSITORY } from '../../core/constants';
import { Profile } from './profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { PhotosService } from '../photos/photos.service';
import { Photo } from '../photos/photo.entity';
import { PhotoDto } from '../photos/dto/photo.dto';

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
    const newProfile: any = (
      await this.profileRepository.create<Profile>({
        ...others,
        userId,
      })
    ).get({ plain: true });
    // create photos if any
    if (photos.length > 0) {
      const photoList = await this.addPhoto({ photos }, userId, {
        profileId: newProfile.id,
      });
      return { ...newProfile, photos: photoList };
    } else {
      // return created profile
      return { ...newProfile, photos: [] };
    }
  }

  async findAll(user): Promise<Profile[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list: any = await this.profileRepository
      .findAll<Profile>({
        where: updateOPtion,
      })
      .map((el) => el.get({ plain: true }));
    // get all photos with exact urls for each profile
    const returnedList = [];
    if (list.length > 0) {
      for (const prof of list) {
        // find all photos for this profile
        const photo = await this.photoService.findAll(
          { profileId: prof.id },
          'profile',
        );
        returnedList.push({ ...prof, photos: photo });
      }
    }

    return returnedList;
  }

  async findOne(id, user): Promise<Profile> {
    // check the role
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    const prof = await this.profileRepository.findOne({
      where: updateOPtion,
    });
    if (prof) {
      const plainProf: any = prof.get({ plain: true });
      const photo = await this.photoService.findAll(
        {
          profileId: plainProf.id,
        },
        'profile',
      );
      return { ...plainProf, photos: photo };
    } else {
      return prof;
    }
  }

  async findMyProfile(userId): Promise<Profile> {
    const prof = await this.profileRepository.findOne({
      where: { userId },
    });
    if (prof) {
      const plainProf: any = prof.get({ plain: true });
      const photo = await this.photoService.findAll(
        {
          profileId: plainProf.id,
        },
        'profile',
      );
      return { ...plainProf, photos: photo };
    } else {
      return prof;
    }
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
    // if (data.photos.length > 0) {
    const createdList = [];
    for (const photo of data.photos) {
      const newPhoto = await this.photoService.create(
        photo.photo,
        userId,
        sourceId,
        { profile: photo.position },
      );
      const { postitionData, ...others } = newPhoto;
      createdList.push({ ...others, position: postitionData.profile });
    }
    // }
    return createdList;
  }

  async deletePhoto(id, userId, name) {
    // remove the photo if all its only attached to profile,
    const checkOtherIds = {
      progressId: null,
      userappId: null,
      feedbackId: null,
    };
    // otherwise only detouch profileId
    const updateSourceId = { profileId: null };
    return await this.photoService.delete(
      id,
      userId,
      name,
      checkOtherIds,
      updateSourceId,
    );
  }

  async deleteProfile(id, user) {
    // find all profile photos
    const profPhtos: any = await Photo.findAll({
      where: { profileId: id },
    }).map((el) => el?.get({ plain: true }));

    // remove the photo if all its only attached to profile,
    const checkOtherIds = {
      progressId: null,
      userappId: null,
      feedbackId: null,
    };
    // otherwise only detouch profileId
    const updateSourceId = { profileId: null };
    if (profPhtos.length > 0) {
      // then delete or detouch profileId from photos
      for (const photo of profPhtos) {
        await this.photoService.delete(
          photo.id,
          user.id,
          photo.photo,
          checkOtherIds,
          updateSourceId,
        );
      }
    }
    // delete profile with this id
    return await this.profileRepository.destroy({
      where: { id, userId: user.id },
    });
  }
}
