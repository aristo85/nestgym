import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    // find if user exist with this email
    const user = await this.userService.findOneUserByEmail(email);
    if (!user) {
      return null;
    }

    // find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    // tslint:disable-next-line: no-string-literal
    const { password, ...result } = user as User & { dataValues: any };
    return result['dataValues'];
  }

  public async login(user: User) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(user: UserDto) {
    const { email } = user;
    // hash the password
    const pass = await this.hashPassword(user.password);

    // create the user
    const newUser = await this.userService.createUser({
      ...user,
      password: pass,
      // email: email.toLowerCase(),
    });

    // tslint:disable-next-line: no-string-literal
    const { password, ...result } = newUser['dataValues'];
    // as User & { dataValues: any };

    // generate token
    const token = await this.generateToken(result);

    // return the user and the token
    return { user: result, token };
  }

  private async generateToken(user: any) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcryptjs.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcryptjs.compare(enteredPassword, dbPassword);
    return match;
  }
}
