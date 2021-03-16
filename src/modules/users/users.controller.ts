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
  Post,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { UserDto, UserPassUpdateDto, UserUpdateDto } from './dto/user.dto';
import { ForgotPassword } from './forgotPassword.entity';
import { Roles, User } from './user.entity';
import { AuthUser, UserRole } from './users.decorator';
import { UsersService } from './users.service';
import * as bcryptjs from 'bcryptjs';

@ApiTags('Users (Пользователи)')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiExcludeEndpoint()
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @UserRole() role: Roles,
  ) {
    console.log('role: ', role);
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

  @ApiExcludeEndpoint()
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

  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id пользователя',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UserUpdateDto,
    @AuthUser() user: User,
  ): Promise<User> {
    // check email
    const userByEmail = await this.userService.findOneUserByEmail(data.email);
    if (userByEmail) {
      throw new ForbiddenException('there is account with this email');
    }
    // get the number of row affected and the updated user
    const {
      numberOfAffectedRows,
      updatedApplication,
    } = await this.userService.updateUser(id, data);

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

  @ApiOperation({ summary: 'Востановление пароля через Email' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @Post('forgotPassword')
  async forgotPassword(
    @Body() userRequest: ForgotPasswordDto,
  ): Promise<ForgotPassword> {
    // chek email
    const { email } = userRequest;
    const foundUser = await this.userService.findOneUserByEmail(email);
    if (!foundUser) {
      throw new NotFoundException("This user doesn't exist");
    }

    // return the updated app
    return this.userService.createForgotPasswordRequest(foundUser);
  }

  // @ApiResponse({ status: 200 })
  // @Delete('forgotPassword/:id')
  // async deleteForgotPassword(@Param('id') id: number): Promise<number> {
  //   const test = await ForgotPassword.findAll({ raw: true, nest: true });
  //   console.log(test);
  //   return await ForgotPassword.destroy({ where: { id } });
  // }

  @ApiOperation({ summary: 'Обновление пароля пользователя' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id пользователя',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put('password/:id')
  async resetPassword(
    @Param('id') id: number,
    @Body() pass: UserPassUpdateDto,
    @AuthUser() user: User,
  ): Promise<User> {
    // check id
    if (+user.id !== +id) {
      throw new ForbiddenException('not your ID');
    }

    // check old password
    const match = await bcryptjs.compare(pass.oldPassword, user.password);
    if (!match) {
      throw new ForbiddenException('wrong password');
    }
    // check new password
    const isNewTheSame = await bcryptjs.compare(
      pass.newPassword,
      user.password,
    );
    if (isNewTheSame) {
      throw new ForbiddenException('New password is the old one!');
    }

    // hash the new password
    const hash = await bcryptjs.hash(pass.newPassword, 10);
    // get the number of row affected and the updated user
    const {
      numberOfAffectedRows,
      updatedUser,
    } = await this.userService.updatePassword(id, hash);

    // if the number of row affected is zero,
    // it means the app doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This User doesn't exist");
    }

    // return the updated app
    return updatedUser;
  }
}
