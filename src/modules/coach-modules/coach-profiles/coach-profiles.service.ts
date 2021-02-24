import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { COATCH_PROFILE_REPOSITORY } from 'src/core/constants';
import { User } from 'src/modules/users/user.entity';
import { CoachService } from '../coach-services/coach-service.entity';
import { CoachServicesService } from '../coach-services/coach-services.service';
import { CoachProfile } from './coach-profile.entity';
import {
  CoachProfileDto,
  CoachProfileUpdateDto,
} from './dto/coach-profile.dto';

import {
  includePhotoOptions,
  PhotosService,
} from 'src/modules/photos/photos.service';

@Injectable()
export class CoachProfilesService {
  constructor(
    @Inject(COATCH_PROFILE_REPOSITORY)
    private readonly coachProfileRepository: typeof CoachProfile,
    private readonly coachServiceService: CoachServicesService,
    private readonly photoService: PhotosService,
  ) {}
  /////////////////////////////////////////////
  
  async createCoachProfile(
    data: CoachProfileDto,
    userId: number,
  ): Promise<{ profile: CoachProfile; services: CoachService[] }> {
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);

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
    const services = await this.coachServiceService.updateMany(
      profile.id,
      coachServices,
    );

    return { profile, services: await services.coachServices };
  }
  /////////////////////////////////////////////

  async findOneCoachProfile(coachProfileId: number): Promise<CoachProfile> {
    return await this.coachProfileRepository.findOne({
      where: { id: coachProfileId },
      include: [...includePhotoOptions, CoachService],
    });

    // return { profile, serviceList };
  }
  /////////////////////////////////////////////

  async findMyCoachProfile(userId: number): Promise<CoachProfile> {
    return await this.coachProfileRepository.findOne({
      where: { userId },
      include: [...includePhotoOptions, CoachService],
    });
  }
  /////////////////////////////////////////////

  async findCoachProfile(coachProfileId: number): Promise<CoachProfile> {
    return await this.coachProfileRepository.findOne({
      where: { id: coachProfileId },
      include: [User],
    });
  }

  async findUserByCoachProfile(
    coachProfileId: number,
  ): Promise<User | undefined> {
    const profile = await this.findCoachProfile(coachProfileId);
    return profile ? profile.user : undefined;
  }

  async deleteCoachProfile(coachProfileId: number, user: User) {
    const profile = await this.findCoachProfile(coachProfileId);

    if (!profile) {
      throw new HttpException('Coach profile not found', HttpStatus.NOT_FOUND);
    }

    const profileOwner = profile.user;

    if (user.role !== 'admin' && profileOwner.id !== user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // delete also the coach services (CASCADE)
    return await this.coachProfileRepository.destroy({
      where: { id: coachProfileId },
    });
  }
  /////////////////////////////////////////////

  async updateCoachProfile(
    coachProfileId: number,
    data: CoachProfileUpdateDto,
    user: User,
  ) {
    const profile = await this.findCoachProfile(coachProfileId);

    if (!profile) {
      throw new HttpException('Coach profile not found', HttpStatus.NOT_FOUND);
    }

    const profileOwner = profile.user;

    if (user.role !== 'admin' && profileOwner.id !== user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);

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
      { where: { id: coachProfileId }, returning: true },
    );

    // create coach services DB
    const services = await this.coachServiceService.updateMany(
      coachProfileId,
      data.coachServices,
    );

    return { numberOfAffectedRows, updatedprofile };
  }
  /////////////////////////////////////////////

  // exported
  async findAllCoachProfiles(user: User): Promise<CoachProfile[]> {
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    // CoachProfile.findOne({})

    const list = await this.coachProfileRepository.findAll<CoachProfile>({
      where: updateOPtion,
      include: [...includePhotoOptions, CoachService],
    });
    // const count = await this.coachProfileRepository.count();
    return list;
  }
  /////////////////////////////////////////////

  async updateCoachProfileFromAdmin(
    coachProfileId: number,
    data: CoachProfileUpdateDto,
    user: User,
  ) {
    const profile = await this.findCoachProfile(coachProfileId);

    if (!profile) {
      throw new HttpException('Coach profile not found', HttpStatus.NOT_FOUND);
    }

    const profileOwner = profile.user;

    if (user.role !== 'admin' && profileOwner.id !== user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const { coachServices, ...other } = data;
    // create coach services DB
    const services = this.coachServiceService.updateMany(
      coachProfileId,
      data.coachServices,
    );

    const [
      numberOfAffectedRows,
      [updatedprofile],
    ] = await this.coachProfileRepository.update(
      { ...other },
      { where: { id: coachProfileId }, returning: true },
    );

    return { numberOfAffectedRows, updatedprofile };
  }
}
