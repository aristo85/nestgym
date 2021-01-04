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

  async create(userapp: UserappDto, userId): Promise<Userapp> {
    return await this.userappRepository.create<Userapp>({ ...userapp, userId });
  }

  async findAll(): Promise<Userapp[]> {
    return await this.userappRepository.findAll<Userapp>({});
  }

  async findOne(id): Promise<Userapp> {
    // this is based on sequelize association which is
    //  a right way for fetching Userapp data, from User
    // const test = await User.findOne({include: [Userapp]})
    // test.userapps.forEach(userapp => console.log(`userapp ${userapp.aim}`));
    return await this.userappRepository.findOne({
      where: { id },
    });
  }

  async delete(id) {
    return await this.userappRepository.destroy({ where: { id } });
  }

  async update(id, data, userId) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.userappRepository.update(
      { ...data },
      { where: { id, userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedApplication };
  }
}
