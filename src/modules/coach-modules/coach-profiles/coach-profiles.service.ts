import { Injectable, Inject } from '@nestjs/common';
import { COATCH_PROFILE_REPOSITORY } from 'src/core/constants';
import { User } from 'src/modules/users/user.entity';
import { CoachService } from '../coach-services/coach-service.entity';
import { CoachServicesService } from '../coach-services/coach-services.service';
import { CoachProfile } from './coach-profile.entity';
import { CoachProfileDto } from './dto/coach-profile.dto';

import { PhotosService } from 'src/modules/photos/photos.service';

@Injectable()
export class CoachProfilesService {
  constructor(
    @Inject(COATCH_PROFILE_REPOSITORY)
    private readonly coachProfileRepository: typeof CoachProfile,
    private readonly coachServiceService: CoachServicesService,
    private readonly photoService: PhotosService,
  ) {}
  /////////////////////////////////////////////
  async create(data: CoachProfileDto, userId): Promise<any> {
    const frontPhoto =
      data.frontPhotoHash &&
      (await this.photoService.findOneByHash(data.frontPhotoHash));
    const sidePhoto =
      data.sidePhotoHash &&
      (await this.photoService.findOneByHash(data.sidePhotoHash));
    const backPhoto =
      data.backPhotoHash &&
      (await this.photoService.findOneByHash(data.backPhotoHash));

    // omit the coachservices prop and create profile
    const { coachServices, ...other } = data;
    const profile = await this.coachProfileRepository.create<CoachProfile>({
      ...other,
      frontPhotoId: frontPhoto?.id,
      sidePhotoId: sidePhoto?.id,
      backPhotoId: backPhoto?.id,
      userId,
    });
    // create coach services DB
    const services = await this.coachServiceService.create(
      coachServices,
      userId,
      profile.id,
    );

    return { profile, services };
  }
  /////////////////////////////////////////////

  async findOne(user, id): Promise<CoachProfile> {
    // check role
    let whereOptions =
      user.role === 'trainer' ? { id, userId: user.id } : { id };
    // return coach services with the profile
    const serviceList = await CoachService.findAll({
      where: { userId: user.id },
    });

    return await this.coachProfileRepository.findOne({
      where: whereOptions,
      include: [{ all: true }],
    });

    // return { profile, serviceList };
  }
  /////////////////////////////////////////////

  async findMyProfile(userId): Promise<CoachProfile> {
    return await this.coachProfileRepository.findOne({
      where: { userId },
      include: [{ all: true }],
    });
  }
  /////////////////////////////////////////////

  async delete(id, user) {
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    // delete also the coach services (CASCADE)
    return await this.coachProfileRepository.destroy({ where: updateOPtion });
  }
  /////////////////////////////////////////////

  async update(id, data, user) {
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };

    const frontPhoto =
      data.frontPhotoHash &&
      (await this.photoService.findOneByHash(data.frontPhotoHash));
    const sidePhoto =
      data.sidePhotoHash &&
      (await this.photoService.findOneByHash(data.sidePhotoHash));
    const backPhoto =
      data.backPhotoHash &&
      (await this.photoService.findOneByHash(data.backPhotoHash));

    const [
      numberOfAffectedRows,
      [updatedprofile],
    ] = await this.coachProfileRepository.update(
      {
        ...data,
        frontPhotoId: frontPhoto?.id,
        sidePhotoId: sidePhoto?.id,
        backPhotoId: backPhoto?.id,
      },
      { where: updateOPtion, returning: true },
    );

    return { numberOfAffectedRows, updatedprofile };
  }
  /////////////////////////////////////////////

  // exported
  async findAll(user): Promise<CoachProfile[]> {
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    // CoachProfile.findOne({})

    const list = await this.coachProfileRepository.findAll<CoachProfile>({
      where: updateOPtion,
      include: [{ all: true }],
    });
    // const count = await this.coachProfileRepository.count();
    return list;
  }
  /////////////////////////////////////////////

  async updateFromAdmin(id, data, user) {
    const { coachservices, ...other } = data;
    await CoachService.destroy({
      where: {
        coachProfileId: id,
      },
    });
    await this.coachServiceService.create(coachservices, user.id, id);
    const [
      numberOfAffectedRows,
      [updatedprofile],
    ] = await this.coachProfileRepository.update(
      { ...other },
      { where: { id }, returning: true },
    );

    return { numberOfAffectedRows, updatedprofile };
  }
}
