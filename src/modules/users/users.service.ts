import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto, UserUpdateDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async createUser(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findOneUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneUserById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findAllUsers(): Promise<User[]> {
    const list = await this.userRepository.findAll<User>({
      attributes: { exclude: ['password'] },
    });
    // const count = await this.userRepository.count();
    // console.log(count);
    return list;
  }

  async updateUser(userId: number, data: UserUpdateDto) {
    const [
      numberOfAffectedRows,
      [updatedApplication],
    ] = await this.userRepository.update(
      { ...data },
      { where: { id: userId }, returning: true },
    );

    return { numberOfAffectedRows, updatedApplication };
  }

  async findOne(userId: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });
  }
}
