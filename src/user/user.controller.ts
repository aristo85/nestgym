import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  public async createUser(@Body() body): Promise<User> {
    return this.userService.createUser(body);
  }
}