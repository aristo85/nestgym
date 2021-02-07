import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { COACH_APP_REPOSITORY } from 'src/core/constants';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { CoachProfile } from '../coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-services/coach-service.entity';
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

    const list = await this.coachappRepository.findAll<Requestedapp>({
      where: updateOPtion,
      include: [{ model: Userapp }],
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
    if (!(app.status === null || app.status === 'pending')) {
      throw new NotFoundException('Application been taken by other coach!');
    }
    // set the answer based on coaches will
    let userapp;
    if (status === 'accept') {
      // update staus of the userapp
      await Userapp.update(
        { status: 'active', coachId: user.id },
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
