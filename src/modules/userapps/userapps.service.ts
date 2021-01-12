import { Injectable, Inject } from '@nestjs/common';
import { APPLICATION_REPOSITORY } from 'src/core/constants';
import { User } from '../users/user.entity';
import { UserappDto } from './userapp.dto';
import { Userapp } from './userapp.entity';

@Injectable()
export class UserappsService {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly userappRepository: typeof Userapp,
  ) {}

  // async findAllForAdmin(): Promise<Userapp[]> {
  //   const list = await this.userappRepository.findAll<Userapp>({});
  //   return list;
  // }

  async create(userapp: UserappDto, userId): Promise<Userapp> {
    return await this.userappRepository.create<Userapp>({ ...userapp, userId });
  }

  async findAll(user): Promise<Userapp[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { userId: user.id };

    const list = await this.userappRepository.findAll<Userapp>({
      where: updateOPtion,
    });
    return list;
  }

  async findOne(id, user): Promise<Userapp> {
    // this is based on sequelize association which is
    //  a right way for fetching Userapp data, from User
    // const test = await User.findOne({include: [Userapp]})
    // test.userapps.forEach(userapp => console.log(`userapp ${userapp.aim}`));

    // check if from admin
    let updateOPtion = user.role === 'admin' ? { id } : { id, userId: user.id };
    return await this.userappRepository.findOne({
      where: updateOPtion,
    });
  }

  async delete(id, userId) {
    return await this.userappRepository.destroy({ where: { id, userId } });
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

    return { numberOfAffectedRows, updatedApplication };
  }
}
