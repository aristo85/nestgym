import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto, UserUpdateDto } from './dto/user.dto';
import {
  FORGOT_PASSWORD_FEEDBACK_REPOSITORY,
  USER_REPOSITORY,
} from '../../core/constants';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ForgotPassword } from './forgotPassword.entity';
import { sendConfirmationEmail } from 'src/core/config/nodemailer.config';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(FORGOT_PASSWORD_FEEDBACK_REPOSITORY)
    private readonly forgotPasswordRepository: typeof ForgotPassword,
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

  async createForgotPasswordRequest(user: User): Promise<ForgotPassword> {
    const [
      passRequest,
      created,
    ] = await this.forgotPasswordRepository.upsert<ForgotPassword>(
      {
        email: user.email,
      },
      { returning: true },
    );
    sendConfirmationEmail(user.name, user.email, passRequest.id);
    return passRequest;
  }
}
