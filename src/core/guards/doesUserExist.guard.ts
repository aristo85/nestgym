import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request & { body: { email?: string } }) {
    if (!request.body.email) {
      throw new ForbiddenException("This email doesn't provided");
    }
    const userExist = await this.userService.findOneUserByEmail(request.body.email);
    if (userExist) {
      throw new ForbiddenException('This email already exist');
    }
    return true;
  }
}
