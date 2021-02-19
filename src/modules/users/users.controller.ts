import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserDto, UserUpdateDto } from './dto/user.dto';
import { Roles, User } from './user.entity';
import { AuthUser, UserRole } from './users.decorator';
import { UsersService } from './users.service';

@ApiTags('Application')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'admin') {
      throw new NotFoundException('only admin');
    }
    // get all apps in the db
    const list = await this.userService.findAllUsers();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<User> {
    // check the role
    if (role !== 'admin' && +id !== +user.id) {
      throw new ForbiddenException('not your account');
    }
    // find the users with this id
    const foundUser = await this.userService.findOne(id);

    // if the users doesn't exit in the db, throw a 404 error
    if (!foundUser) {
      throw new NotFoundException("This app doesn't exist");
    }

    // if users exist, return users
    return foundUser;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UserUpdateDto,
    @UserRole() role: Roles,
  ): Promise<User> {
    // check the role
    if (role !== 'admin') {
      throw new NotFoundException('only admin');
    }
    // get the number of row affected and the updated user
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.userService.updateUser(id, user);

    // if the number of row affected is zero,
    // it means the app doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return the updated app
    return updatedApplication;
  }

  // // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // async remove(@Param('id') id: number) {
  //   // delete the app with this id
  //   const deleted = await this.userappService.delete(id);

  //   // if the number of row affected is zero,
  //   // then the app doesn't exist in our db
  //   if (deleted === 0) {
  //     throw new NotFoundException("This app doesn't exist");
  //   }

  //   // return success message
  //   return 'Successfully deleted';
  // }
}
