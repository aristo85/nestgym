import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from 'src/core/constants';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { DietProduct } from '../coach-modules/dietproducts/dietproduct.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { Photo } from '../photos/photo.entity';
import { PhotosService } from '../photos/photos.service';
import { UserWorkout } from '../user-workouts/user-workout.entity';
import { UserappDto } from './userapp.dto';
import { Userapp } from './userapp.entity';

export interface createPromise {
  createdUserapp: Userapp;
  matches: CoachProfile[];
}

@Injectable()
export class UserappsService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly userappRepository: typeof Userapp,
    private readonly photoService: PhotosService,
  ) {}

  async create(userapp: UserappDto, userId): Promise<createPromise> {
    // create application first
    const { photos, ...others } = userapp;
    const createdUserapp: any = (
      await this.userappRepository.create<Userapp>({
        ...others,
        userId,
      })
    ).get({ plain: true });
    // create photos if any
    if (photos.length > 0) {
      // const createdList = await this.photoService.create(
      //   photos,
      //   userId,
      //   {
      //     userappId: createdUserapp.id,
      //   },
      // );
      // return created application with photos and matches
      let matches: CoachProfile[] = await this.coachMatches(createdUserapp);
      return {
        createdUserapp: {
          ...createdUserapp,
          //  pootos: createdList
        },
        matches,
      };
    } else {
      //return profile with matches
      let matches: CoachProfile[] = await this.coachMatches(createdUserapp);
      return { createdUserapp: { ...createdUserapp, pootos: [] }, matches };
    }
  }

  async findAll(user): Promise<any[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list: any = await this.userappRepository
      .findAll<Userapp>({
        where: updateOPtion,
        include: [
          Requestedapp,
          {
            model: FullProgWorkout,
            limit: 1,
            order: [['createdAt', 'DESC']],
            include: [{ model: WorkoutProgram }],
          },
          {
            model: DietProgram,
            limit: 1,
            order: [['createdAt', 'DESC']],
            include: [DietProduct],
          },
          { model: UserWorkout, limit: 7 },
        ],
      })
      .map((el) => el.get({ plain: true }));
    let listWithProfile = [];
    if (list.length > 0) {
      for (const app of list) {
        // find all photos in this app
        const photo = await this.photoService.findAll(
          { userappId: app.id },
          'userapp',
        );
        // add coach profile if the app been accepted by a coach
        const coachProfile =
          app.coachId &&
          (await CoachProfile.findOne({
            where: {
              userId: app.coachId,
            },
          }));
        coachProfile
          ? listWithProfile.push({ ...app, photos: photo, coachProfile })
          : listWithProfile.push({ ...app, photos: photo });
      }
    }

    return listWithProfile;
  }

  async findOne(id, user): Promise<any> {
    // check the role
    let updateOPtion = user.role !== 'admin' ? { id, userId: user.id } : { id };
    const app = await this.userappRepository.findOne({
      where: updateOPtion,
      include: [
        Requestedapp,
        {
          model: FullProgWorkout,
          include: [{ model: WorkoutProgram }],
        },
        { model: DietProgram, include: [DietProduct] },
        { model: UserWorkout, limit: 7 },
      ],
    });
    if (app) {
      const plainAppData: any = app.get({ plain: true });
      // find all photos in this app
      const photo = await this.photoService.findAll(
        { userappId: app.id },
        'userapp',
      );
      const coachProfile =
        plainAppData.coachId &&
        (await CoachProfile.findOne({
          where: {
            userId: plainAppData.coachId,
          },
        }));
      const returnedData = coachProfile
        ? { ...plainAppData, photos: photo, coachProfile }
        : { ...plainAppData, photos: photo };
      return returnedData;
    } else {
      return app;
    }
  }

  async delete(id, user) {
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    // first delete photos (or delete uaerappId if optional)
    const checkOtherIds = {
      progressId: null,
      profileId: null,
      feedbackId: null,
    };
    const updateSourceId = { userappId: null };
    const photos: any = await Photo.findAll({
      where: { userappId: id },
    }).map((el) => el?.get({ plain: true }));
    if (photos.length > 0) {
      for (const pic of photos) {
        await this.photoService.delete(
          pic.id,
          user.id, //probably wont be used
          pic.photo,
          checkOtherIds,
          updateSourceId,
        );
      }
    }
    // then remove the app
    return await this.userappRepository.destroy({ where: updateOPtion });
  }

  async update(id, data, user) {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };

    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.userappRepository.update(
      { ...data },
      { where: updateOPtion, returning: true },
    );

    let matches: CoachProfile[] = await this.coachMatches({ ...data });

    return { numberOfAffectedRows, updatedApplication, matches };
  }

  async findMatches(userappId) {
    // const list = await this.coachProfileRepository.findAll();
    const application: any = await Userapp.findOne({
      where: { id: userappId },
    });
    // filtering with application parametters
    const list = this.coachMatches(application);
    return list;
  }

  // async addPhoto(data, userId, sourceId) {
  //   return this.photoService.create(data, userId, sourceId);
  // }

  async deletePhoto(id, userId, name) {
    const checkOtherIds = {
      progressId: null,
      profileId: null,
      feedbackId: null,
    };
    const updateSourceId = { userappId: null };
    return await this.photoService.delete(
      id,
      userId, //probably wont be used
      name,
      checkOtherIds,
      updateSourceId,
    );
  }

  // async findAllForAdmin(): Promise<Userapp[]> {
  //   const list = await this.userappRepository.findAll<Userapp>({});
  //   return list;
  // }

  //////////////////////////////////////////////////////////////////////////
  // matching function
  coachMatches = async (userapp: Userapp): Promise<CoachProfile[]> => {
    if (!userapp) {
      throw new NotFoundException('this profile is not exist');
    }
    const coachProfiles: any = await CoachProfile.findAll<CoachProfile>({
      include: [CoachService],
    });
    let newList = [];
    coachProfiles.forEach((coachProfile) => {
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
}
