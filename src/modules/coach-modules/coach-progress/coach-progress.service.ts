import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { UserappsService } from '../../userapps/userapps.service';
import { User } from 'src/modules/users/user.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';

@Injectable()
export class CoachProgressService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userappsService: UserappsService,
  ) {}

  async getUserProgress(
    coachUserId: number,
    coachUser: User,
    clientUserId: number,
  ) {
    const coachActiveAppsUsers = await this.userappsService.getAllCoachAppsUsers(
      coachUserId,
      'active',
      clientUserId,
    );
    return coachActiveAppsUsers;
  }

  async getUsersProgress(coachUserId: number, coachUser: User) {
    const coachActiveAppsUsers = await this.userappsService.getAllCoachAppsUsers(
      coachUserId,
      'active',
    );
    return coachActiveAppsUsers;
  }
}
