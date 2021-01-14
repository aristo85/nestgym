import { Injectable, Inject } from '@nestjs/common';
import { REQUESTED_APP_REPOSITORY } from 'src/core/constants';
import { CoachProfilesService } from '../coach-modules/coach-profiles/coach-profiles.service';
import { Userapp } from '../userapps/userapp.entity';
import { Requsetedapp } from './requestedapp.entity';

@Injectable()
export class RequestedappsService {
  constructor(
    @Inject(REQUESTED_APP_REPOSITORY)
    private readonly requestedappRepository: typeof Requsetedapp,
    private readonly coachProfileRepository: CoachProfilesService,
  ) {}

  async create(userId, coachId, userappId): Promise<Requsetedapp> {
    return await this.requestedappRepository.create<Requsetedapp>({
      userId,
      coachId,
      userappId,
      status: 'pending',
    });
  }

  //   async findAll(user): Promise<Userapp[]> {
  //     // check if from admin
  //     let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

  //     const list = await this.userappRepository.findAll<Userapp>({
  //       where: updateOPtion,
  //     });
  //     return list;
  //   }

  //   async findOne(id, user): Promise<Userapp> {
  //     // this is based on sequelize association which is
  //     //  a right way for fetching Userapp data, from User
  //     // const test = await User.findOne({include: [Userapp]})
  //     // test.userapps.forEach(userapp => console.log(`userapp ${userapp.aim}`));

  //     // check if from admin
  //     let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
  //     return await this.userappRepository.findOne({
  //       where: updateOPtion,
  //     });
  //   }

  //   async delete(id, userId) {
  //     return await this.userappRepository.destroy({ where: { id, userId } });
  //   }

  //   async update(id, data, user) {
  //     // check if from admin
  //     let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };

  //     const [
  //       numberOfAffectedRows,
  //       [updatedApplication],
  //     ] = await this.userappRepository.update(
  //       { ...data },
  //       { where: updateOPtion, returning: true },
  //     );

  //     return { numberOfAffectedRows, updatedApplication };
  //   }
}
