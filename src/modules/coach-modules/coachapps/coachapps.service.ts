import { Inject, Injectable } from '@nestjs/common';
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

  async create(userId, coachId, userappId): Promise<Requestedapp> {
    const requestedapp = await this.coachappRepository.create<Requestedapp>({
      userId,
      coachId,
      userappId,
    });

    // update the staus of the userapp and add the coach profile to it
    let coach = await CoachProfile.findOne({
      where: { userId: coachId },
      include: [CoachService],
    });
    //  const coachStr = JSON.stringify(coach)
    //  console.log(coachStr)
    await Userapp.update(
      { status: 'pending', coachProfile: coach },
      { where: { id: userappId }, returning: true },
    );

    return requestedapp;
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
  async update(userappId, status) {
    // check if from admin
    // let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };

    // update the staus of the userapp
    const userapp = await Userapp.update(
      { status },
      { where: { id: userappId }, returning: true },
    );
    return userapp;
  }
}
