import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { COACH_APP_REPOSITORY } from 'src/core/constants';
import { Profile } from 'src/modules/profiles/profile.entity';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { DietObj } from 'src/modules/userapps/userapps.service';
import { CoachProfile } from '../coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-services/coach-service.entity';
import { DietProgram } from '../dietprogram/dietprogram.entity';
import { isJson } from '../dietprogram/dietprogram.service';
import { FullProgWorkout } from '../full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';
import { Requestedapp } from './coachapp.entity';

@Injectable()
export class CoachappsService {
  constructor(
    @Inject(COACH_APP_REPOSITORY)
    private readonly coachappRepository: typeof Requestedapp,
  ) {}

  async create(
    userId: number,
    coachId: number,
    userappId: number,
  ): Promise<Requestedapp> {
    // check the coachId
    const coach = await CoachProfile.findOne({
      where: { userId: coachId },
      include: [CoachService],
    });

    if (coach === null) {
      throw new NotFoundException(`coach does not found`);
    }

    // update staus of the userapp
    // check the app status
    const appStatus = await Userapp.findOne({
      where: {
        id: userappId,
      },
    });

    if (appStatus.status === null) {
      await Userapp.update(
        { status: 'pending' },
        {
          where: {
            id: userappId,
          },
        },
      );
    } else if (appStatus.status !== 'pending') {
      throw new NotFoundException('this app been picked');
    }

    const newRequestedApp = await this.coachappRepository.create<Requestedapp>({
      userId,
      coachId,
      userappId,
    });

    return newRequestedApp;
  }

  async findApp(id, userId): Promise<Userapp> {
    return await Userapp.findOne({ where: { id, userId } });
  }

  async findOne(id): Promise<Requestedapp> {
    return await this.coachappRepository.findOne({
      where: { id },
      include: [{ model: Userapp }],
    });
  }

  async findAll(user): Promise<Requestedapp[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list: any = await this.coachappRepository
      .findAll<Requestedapp>({
        where: updateOPtion,
        include: [
          {
            model: Userapp,
            include: [
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
              },
              { model: UserWorkout, limit: 7 },
            ],
          },
        ],
      })
      .map(async (el) => {
        const request = el.get({ plain: true }) as Requestedapp;
        const app = request.userapp;
        console.log(app.dietprograms);
        // change json days to obj
        const diets: DietObj[] = app.dietprograms.map((diet) => {
          let dataJson = isJson(diet.days);
          while (isJson(dataJson)) {
            dataJson = isJson(dataJson);
          }
          return { ...diet, days: dataJson };
        });
        // add coach profile if the request been accepted by a coach
        const userProfile = await Profile.findOne({
          where: {
            userId: request.userId,
          },
        });
        return userProfile
          ? {
              ...request,
              userapp: { ...app, dietprograms: diets },
              userProfile,
            }
          : { ...request, userapp: { ...app, dietprograms: diets } };
      });

    return list;
  }

  async findByQuery(user, query): Promise<Requestedapp[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list: any[] = await this.coachappRepository
      .findAll<Requestedapp>({
        where: { ...updateOPtion, status: query.status },
        include: [
          {
            model: Userapp,
            include: [
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
              },
              { model: UserWorkout, limit: 7 },
            ],
          },
        ],
      })
      .map(async (el) => {
        const request = el.get({ plain: true }) as Requestedapp;
        const app = request.userapp;
        console.log(app.dietprograms);
        // change json days to obj
        const diets: DietObj[] = app.dietprograms.map((diet) => {
          let dataJson = isJson(diet.days);
          while (isJson(dataJson)) {
            dataJson = isJson(dataJson);
          }
          return { ...diet, days: dataJson };
        });
        // add coach profile if the request been accepted by a coach
        const userProfile = await Profile.findOne({
          where: {
            userId: request.userId,
          },
        });
        return userProfile
          ? {
              ...request,
              userapp: { ...app, dietprograms: diets },
              userProfile,
            }
          : { ...request, userapp: { ...app, dietprograms: diets } };
      });

    return list;
  }

  //
  async update(userappId, status, user) {
    // check application status
    const app = await Userapp.findOne({
      where: { id: userappId },
      include: [Requestedapp],
    });
    // if (!(app.status === null || app.status === 'pending')) {
    //   throw new NotFoundException('Application been taken by other coach!');
    // }
    // set the answer based on coaches will
    let userapp;
    if (status === 'accept') {
      // update staus of the userapp
      const coachProfile = await CoachProfile.findOne({
        where: { userId: user.id },
      });
      await Userapp.update(
        {
          status: 'active',
          coachId: user.id,
          coachProfileId: coachProfile.id,
        },
        { where: { id: userappId } },
      );
      if (app.requestedapps.length > 1) {
        // update status of other requests to "archived"
        await this.coachappRepository.update(
          { status: 'archived' },
          {
            where: {
              coachId: {
                [Op.notIn]: [user.id],
              },
              userappId,
            },
          },
        );
      }
      // update staus of this Request
      userapp = await this.coachappRepository.update(
        { status: 'accept' },
        { where: { coachId: user.id, userappId }, returning: true },
      );
    } else {
      // otherwise reject
      userapp = await this.coachappRepository.update(
        { status: 'reject' },
        { where: { coachId: user.id, userappId }, returning: true },
      );
    }
    return userapp;
  }
}
