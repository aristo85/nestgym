import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { COACH_APP_REPOSITORY } from 'src/core/constants';
import { Photo } from 'src/modules/photos/photo.entity';
import { includePhotoOptions } from 'src/modules/photos/photos.service';
import { Profile } from 'src/modules/profiles/profile.entity';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { UserappsService } from 'src/modules/userapps/userapps.service';
import { User } from 'src/modules/users/user.entity';
import { CoachNote } from '../coach-noates/coachNote.entity';
import { CoachProfile } from '../coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-services/coach-service.entity';
import { DietProgram } from '../dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../full-progworkouts/full.progworkout.enity';
// import { WorkoutProgram } from '../workout-programs/workout-program.entity';
import { ApplicationRequestStatus, Requestedapp } from './coachapp.entity';

@Injectable()
export class CoachappsService {
  constructor(
    @Inject(COACH_APP_REPOSITORY)
    private readonly coachappRepository: typeof Requestedapp,
    private readonly userappService: UserappsService,
  ) {}

  //////////////////////////////////////////////////
  async createAppRequest(
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

    // add expire date 72 hours
    const expiresAt = new Date().getTime() + 259200000;

    const newRequestedApp = await this.coachappRepository.create<Requestedapp>({
      userId,
      coachId,
      userappId,
      expireDate: expiresAt,
    });

    return newRequestedApp;
  }

  async findApp(userappId: number, userId: number): Promise<Userapp> {
    return await Userapp.findOne({ where: { id: userappId, userId } });
  }

  async findOneCoachAppRequest(
    CoachAppRequestId: number,
  ): Promise<Requestedapp> {
    return await this.coachappRepository.findOne({
      where: { id: CoachAppRequestId },
      include: [{ model: Userapp, include: [CoachNote] }],
    });
  }

  //////////////////////////////////////////////////
  async findAllCoachAppRequest(coachUserId?: number): Promise<Requestedapp[]> {
    const dataOptions = coachUserId ? { coachId: coachUserId } : {};
    const list: any = await this.coachappRepository.findAll<Requestedapp>({
      where: dataOptions,
      include: [
        {
          model: Userapp,
          include: [
            ...includePhotoOptions,
            { model: CoachNote },
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] },
              include: [
                {
                  model: Profile,
                  include: [
                    { model: Photo, as: 'frontPhoto' },
                    { model: Photo, as: 'sidePhoto' },
                    { model: Photo, as: 'backPhoto' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    return list;
  }

  //////////////////////////////////////////////////
  async findCoachAppRequestByQuery(
    coachUserId: number,
    status: ApplicationRequestStatus,
  ): Promise<Requestedapp[]> {
    // check if from admin
    const list = await this.coachappRepository.findAll<Requestedapp>({
      where: { coachId: coachUserId, status },
      include: [
        {
          model: Userapp,
          include: [
            ...includePhotoOptions,
            { model: CoachNote },
            {
              model: FullProgWorkout,
              limit: 1,
              order: [['createdAt', 'DESC']],
              // include: [{ model: WorkoutProgram }],
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
    });

    return list;
  }

  //////////////////////////////////////////////////
  async findCoachActiveApps(
    coachUserId: number,
    addNote = false,
  ): Promise<Userapp[]> {
    return await this.userappService.getActiveCoachApps(coachUserId, addNote);
  }

  //////////////////////////////////////////////////
  async updateCoachRequest(
    userappId: number,
    coachUserId: number,
    status: ApplicationRequestStatus,
  ) {
    // check application status
    const app = await Userapp.findOne({
      where: { id: userappId },
      include: [Requestedapp],
    });

    if (!(app.status === 'pending')) {
      throw new NotFoundException('This app been taken or not availbale!');
    }

    // set the answer based on coaches will
    if (status === 'accept') {
      const coachProfile = await CoachProfile.findOne({
        where: { userId: coachUserId },
      });

      // add expire date 72 hours
      const expiresAt = new Date().getTime() + 259200000;

      // update staus of the userapp
      await Userapp.update(
        {
          status: 'active',
          coachId: coachUserId,
          coachProfileId: coachProfile.id,
          expireDate: expiresAt,
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
                [Op.notIn]: [coachUserId],
              },
              userappId,
            },
          },
        );
      }
      // update staus of this Request
      const [rows, coachRequest] = await this.coachappRepository.update(
        { status: 'accept' },
        { where: { coachId: coachUserId, userappId }, returning: true },
      );

      return coachRequest;
    } else {
      // otherwise reject
      const [rows, coachRequest] = await this.coachappRepository.update(
        { status: 'reject' },
        { where: { coachId: coachUserId, userappId }, returning: true },
      );

      return coachRequest;
    }
  }
  //////////////////////////////////////////////////
  async checkRequestExpireForCron() {
    const currentDate = new Date().toISOString();
    const [rows, coachRequest] = await this.coachappRepository.update(
      { status: 'reject' },
      {
        where: {
          status: 'pending',
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
