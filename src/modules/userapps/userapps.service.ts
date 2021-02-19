import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from 'src/core/constants';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { Photo } from '../photos/photo.entity';
import { includePhotoOptions, PhotosService } from '../photos/photos.service';
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
  ) {}

  async createUserapp(
    userapp: UserappDto,
    userId: number,
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
          include: [{ model: WorkoutProgram, limit: 10 }],
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
    // .map((el: Userapp) => {
    //   const app: Userapp = el.get({ plain: true }) as Userapp;
    //   // change json days to obj
    //   const diets: DietObj[] = app.dietprograms.map((diet) => {
    //     let dataJson = isJson(diet.days);
    //     while (isJson(dataJson)) {
    //       dataJson = isJson(dataJson);
    //     }
    //     return { ...diet, days: dataJson };
    //   });
    //   return { ...app, dietprograms: diets };
    // });

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
          include: [{ model: WorkoutProgram }],
        },
        DietProgram,
        { model: UserWorkout, limit: 7 },
      ],
    });

    return app;
    // if (app) {
    //   const plainAppData: Userapp = app.get({ plain: true }) as Userapp;
    //   // change json days to obj
    //   const diets: DietObj[] = plainAppData.dietprograms.map((diet) => {
    //     let dataJson = isJson(diet.days);
    //     while (isJson(dataJson)) {
    //       dataJson = isJson(dataJson);
    //     }
    //     return { ...diet, days: dataJson };
    //   });
    //   const coachProfile =
    //     plainAppData.coachProfile &&
    //     (await CoachProfile.findOne({
    //       where: {
    //         userId: plainAppData.coachProfile.id,
    //       },
    //       include: [{ all: true }],
    //     }));

    //   const returnedData = coachProfile
    //     ? { ...plainAppData, dietprograms: diets, coachProfile }
    //     : { ...plainAppData, dietprograms: diets };

    //   return returnedData as Userapp;
    // } else {
    //   return app;
    // }
  }

  async deleteUserapp(userappId: number, userId: number, role: string) {
    let conditionOption =
      role === 'admin' ? { id: userappId } : { id: userappId, userId };

    // then remove the app
    return await this.userappRepository.destroy({ where: conditionOption });
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

    const {
      frontPhoto,
      sidePhoto,
      backPhoto,
    } = await this.photoService.findAllThreePostion(data);

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
    const coachProfiles: any = await CoachProfile.findAll<CoachProfile>({
      include: [...includePhotoOptions, CoachService],
    });
    let newList: CoachProfile[] = [];
    coachProfiles.forEach((coachProfile: CoachProfile) => {
      // const test = this.arrFilter(coachProfile.aim, ['fixing', '6']);
      if (this.arrFilter(coachProfile.aim, userapp.aim).length > 0) {
        newList.push(coachProfile);
      } else if (
        this.arrFilter(coachProfile.sportTypes, userapp.sportTypes).length > 0
      ) {
        newList.push(coachProfile);
      } else if (this.arrFilter(coachProfile.place, userapp.place).length > 0) {
        newList.push(coachProfile);
      } else if (
        this.arrFilter(coachProfile.serviceTypes, userapp.serviceTypes).length >
        0
      ) {
        newList.push(coachProfile);
      }
    });
    return newList.length > 0 ? newList : coachProfiles;
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
}
