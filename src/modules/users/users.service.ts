import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    const list = await this.userRepository.findAll<User>({
      attributes: { exclude: ['password'] },
    });
    // const count = await this.userRepository.count();
    // console.log(count);
    return list;
  }

  async update(id, data) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.userRepository.update(
      { ...data },
      { where: { id }, returning: true },
    );

    return { numberOfAffectedRows, updatedApplication };
  }

  async findOne(id): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
  }
}
