import { Injectable, Inject } from '@nestjs/common';
// import { USER_REPOSITORY } from '../utils/constants';
import { User } from './user.entity';
import { CreateUserDto } from './dto/index';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll<User>();
  }

  async createUser(createUser: CreateUserDto): Promise<User> {
    return await this.userRepository.create<User>(createUser);
  }
}
