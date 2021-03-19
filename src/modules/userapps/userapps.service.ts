import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { APPLICATION_REPOSITORY } from 'src/core/constants';
import { CoachNote } from '../coach-modules/coach-noates/coachNote.entity';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { Feedback } from '../feedbacks/feedback.entity';
import { photoPositionTypes } from '../photos/dto/photo.dto';
import { Photo } from '../photos/photo.entity';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
import { Profile } from '../profiles/profile.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { UserProgress } from '../user-progress/user-progress.entity';
import { UserWorkout } from '../user-workouts/user-workout.entity';
import { User } from '../users/user.entity';
import { UserappDto } from './userapp.dto';
import { ApplicationStatus, Userapp } from './userapp.entity';

export interface createPromise {
  createdUserapp: Userapp;
  matches: CoachProfile[];
}

export type DietObj = DietProgram | { days: any };

@Injectable()
export class UserappsService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly userappRepository: typeof Userapp,
    private readonly photoService: PhotosService,
    private readonly profileService: ProfilesService,
  ) {}

  async createUserapp(
    userapp: UserappDto,
    userId: number,
    clientProfileId: number,
  ): Promise<createPromise> {
    // photos
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(userapp);

    // create application first
    const createdUserapp = await this.userappRepository.create<Userapp>({
      ...userapp,
      frontPhotoId: frontPhoto?.id,
      sidePhotoId: sidePhoto?.id,
      backPhotoId: backPhoto?.id,
      userId,
      clientProfileId,
    });
    //return profile with matches
    const matches: CoachProfile[] = await this.coachMatches(createdUserapp);
    return { createdUserapp: createdUserapp, matches };
  }

  async findAllUserapps(userId: number, role: string): Promise<Userapp[]> {
    // check if from admin
    let conditionOption = role === 'admin' ? {} : { userId };

    const list: any = await this.userappRepository.findAll<Userapp>({
      where: conditionOption,
      include: [
        ...includePhotoOptions,
        Requestedapp,
        {
          model: FullProgWorkout,
          limit: 1,
          order: [['createdAt', 'DESC']],
          // include: [{ model: WorkoutProgram, limit: 10 }],
        },
        {
          model: DietProgram,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        { model: UserWorkout, limit: 7, order: [['updatedAt', 'DESC']] },
        {
          model: CoachProfile,
          as: 'coachProfile',
          include: [{ all: true }],
        },
      ],
    });
    return list;
  }

  async findOneUserapp(
    userappId: number,
    userId: number,
    role: string,
  ): Promise<Userapp> {
    // check the role
    let conditionOption =
      role !== 'admin' ? { id: userappId, userId } : { id: userappId };
    const app = await this.userappRepository.findOne({
      where: conditionOption,
      include: [
        ...includePhotoOptions,
        Requestedapp,
        {
          model: FullProgWorkout,
          // include: [{ model: WorkoutProgram }],
        },
        DietProgram,
        { model: UserWorkout, limit: 7 },
      ],
    });

    return app;
  }

  async deleteUserapp(userappId: number, userId: number, role: string) {
    let conditionOption =
      role === 'admin' ? { id: userappId } : { id: userappId, userId };

    // find all photos in app
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.findUserappWithPhotosForDeletion(userappId);

    // then remove the app
    const deleted = await this.userappRepository.destroy({
      where: conditionOption,
    });
    // if nothing to delete
    if (deleted === 0) {
      return deleted;
    }

    //remove photos from DB if was last module
    await this.photoService.checkPhotoPositionsAndDelete(
      frontPhoto,
      sidePhoto,
      backPhoto,
    );

    return deleted;
  }

  async updateUserapp(
    userappId: number,
    data: UserappDto,
    userId: number,
    role: string,
  ) {
    // check if from admin
    let conditionOption =
      role === 'admin' ? { id: userappId } : { id: userappId, userId };

    // from the data update
    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);
    // before updating
    const beforeUpdate = await this.findUserappWithPhotosForDeletion(userappId);

    // update
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.userappRepository.update(
      {
        ...data,
        frontPhotoId: frontPhoto?.id,
        sidePhotoId: sidePhoto?.id,
        backPhotoId: backPhoto?.id,
      },
      { where: conditionOption, returning: true },
    );

    let matches: CoachProfile[] = await this.coachMatches({ ...data });

    // if nothing to update
    if (numberOfAffectedRows === 0) {
      return { numberOfAffectedRows, updatedApplication, matches };
    }

    //remove photos from DB if was last module
    await this.photoService.checkPhotoPositionsAndDelete(
      beforeUpdate.frontPhoto,
      beforeUpdate.sidePhoto,
      beforeUpdate.backPhoto,
    );
    return { numberOfAffectedRows, updatedApplication, matches };
  }

  async findMatches(userappId: number) {
    // const list = await this.coachProfileRepository.findAll();
    const application: any = await Userapp.findOne({
      where: { id: userappId },
    });
    // filtering with application parametters
    const list = this.coachMatches(application);
    return list;
  }

  //////////////////////////////////////////////////////////////////////////
  // matching function
  coachMatches = async (userapp: UserappDto): Promise<CoachProfile[]> => {
    if (!userapp) {
      throw new NotFoundException('this profile is not exist');
    }
    // mathch profiles
    const coachProfiles: CoachProfile[] = await CoachProfile.findAll<CoachProfile>(
      {
        include: [
          ...includePhotoOptions,
          { model: User, include: [Feedback], attributes: ['name'] },
          {
            model: CoachService,
            where: {
              [Op.or]: [
                { sportType: userapp.sportType },
                { serviceType: userapp.serviceType },
              ],
            },
          },
        ],
      },
    );
    // get all profiles
    const allProfiles: CoachProfile[] = await CoachProfile.findAll<CoachProfile>(
      {
        include: [
          ...includePhotoOptions,
          CoachService,
          { model: User, include: [Feedback], attributes: ['name'] },
        ],
      },
    );
    return coachProfiles.length > 0 ? coachProfiles : allProfiles;
  };
  // filter array function
  arrFilter = (arr1: string[], arr2: string[]) => {
    return arr1.filter((el) => arr2.includes(el));
  };

  async getAllCoachApps(
    coachUserId: number,
    applicationStatus: ApplicationStatus,
  ) {
    const coachUserapps = await Userapp.findAll({
      where: { coachId: coachUserId, status: applicationStatus },
    });
    return coachUserapps;
  }

  async getAllCoachAppsUsers(
    coachUserId: number,
    applicationStatus: ApplicationStatus,
    progressLimit: number | undefined = 1,
  ) {
    const usersByApps = await User.findAll<
      User & { userprogresses: UserProgress[] }
    >({
      include: [
        {
          model: Userapp,
          required: true,
          where: { coachId: coachUserId, status: applicationStatus },
        },
        {
          model: UserProgress,
          limit: progressLimit,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    return usersByApps;
  }

  async getActiveCoachApps(
    coachUserId: number,
    addNote = false,
    // applicationStatus: ApplicationStatus,
  ): Promise<Userapp[]> {
    // check if from admin
    // let conditionOption = role === 'admin' ? {} : { userId };

    const note = addNote ? [{ model: CoachNote }] : [];

    const list = await this.userappRepository.findAll<Userapp>({
      where: { coachId: coachUserId, status: 'active' },
      include: [
        ...includePhotoOptions,
        ...note,
        Requestedapp,
        {
          model: FullProgWorkout,
          limit: 1,
          order: [['createdAt', 'DESC']],
          // include: [{ model: WorkoutProgram, limit: 10 }],
        },
        {
          model: DietProgram,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        { model: UserWorkout, limit: 7 },
        {
          model: Profile,
          include: [
            { model: Photo, as: 'frontPhoto' },
            { model: Photo, as: 'sidePhoto' },
            { model: Photo, as: 'backPhoto' },
          ],
        },
      ],
    });
    return list;
  }

  // update the currentUserapp in client's profile
  async setCurrentUserapp(userappId, userId) {
    // find profile
    const profile = await Profile.findOne({
      where: { userId },
      raw: true,
      nest: true,
    });
    // update profile
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedProfile,
    } = await this.profileService.setCurrentUserapp(
      profile.id,
      userappId,
      userId,
    );
    return numberOfAffectedRows;
  }
  /////////////////////////////////////////////

  async deleteUserappPhoto(
    userappId: number,
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
    await this.userappRepository.update(updateOptions, {
      where: { id: userappId, userId: userId },
    });

    // delete the photo with this id
    const deleted = await this.photoService.deletePhoto(photoId, photoFileName);
    return deleted;
  }

  async findUserappByPhotoPosition(
    userappId: number,
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
    return await this.userappRepository.findOne({
      where: { ...dataOptions, userId: userId, id: userappId },
    });
  }
  /////////////////////////////////////////////

  async findUserappWithPhotosForDeletion(userappId: number) {
    return await this.userappRepository.findOne({
      where: { id: userappId },
      include: [...includePhotoOptions],
      raw: true,
      nest: true,
    });
  }

  async findCurrentActiveUserapp(
    userappId: number,
    userId: number,
    role: string,
  ): Promise<Userapp> {
    // check the role
    let conditionOption =
      role !== 'admin' ? { id: userappId, userId } : { id: userappId };
    const app = await this.userappRepository.findOne({
      where: conditionOption,
      include: [
        ...includePhotoOptions,
        Requestedapp,
        {
          model: FullProgWorkout,
          limit: 1,
          order: [['createdAt', 'DESC']],
          // include: [{ model: WorkoutProgram, limit: 10 }],
        },
        {
          model: DietProgram,
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
        { model: UserWorkout, limit: 7 },
        {
          model: CoachProfile,
          as: 'coachProfile',
          include: [{ all: true }],
        },
      ],
    });

    return app;
  }
  /////////////////////////////////////////////
  async clientResponseToPayOrReject(
    userappId: number,
    responseStatus: string,
    regular: boolean,
    comment: string,
  ) {
    if (responseStatus === 'reject') {
      // update
      const [
        numberOfAffectedRows,
        [updatedApplication],
      ] = await this.userappRepository.update(
        {
          comment: comment,
          status: 'archived',
        },
        { where: { id: userappId }, returning: true },
      );
      return updatedApplication;
    }

    // set expireDate to 30 days or undefined
    const expiresAt = new Date().getTime() + 2592000000;
    const expireDate = regular ? expiresAt : undefined;

    if (responseStatus === 'accept') {
      // TODO: Payment

      // update
      const [
        numberOfAffectedRows,
        [updatedApplication],
      ] = await this.userappRepository.update(
        {
          status: 'active',
          expireDate,
        },
        { where: { id: userappId }, returning: true },
      );
      return updatedApplication;
    }
  }
  /////////////////////////////////////////////
  //  cron checks unpaid apps during 72 hours
  async checkUserappExpirationForCron() {
    const currentDate = new Date().toISOString();
    const [rows, coachRequest] = await this.userappRepository.update(
      { status: 'archived' },
      {
        where: {
          status: 'notPaid',
          expireDate: {
            [Op.lt]: currentDate,
          },
        },
        returning: true,
      },
    );
    return rows;
  }
  /////////////////////////////////////////////
  // cron check active apps during 30 days
  async checkUserappExpirationPaymentForCron() {
    // set expire date to 72 hours
    const expiresAt = new Date().getTime() + 259200000;
    const currentDate = new Date().toISOString();
    const [rows, coachRequest] = await this.userappRepository.update(
      { status: 'notPaid', expireDate: expiresAt },

      {
        where: {
          status: 'active',
          expireDate: {
            [Op.lt]: currentDate,
          },
        },
        returning: true,
      },
    );
    return rows;
  }
}
