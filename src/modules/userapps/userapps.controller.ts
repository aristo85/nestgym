import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { createPromise, UserappDto } from './userapp.dto';
import { Userapp } from './userapp.entity';
import { UserappsService } from './userapps.service';

@ApiBearerAuth()
@Controller('userapps')
export class UserappsController {
  constructor(private readonly userappService: UserappsService) {}

  @ApiTags('Client-Application')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() userapp: UserappDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<createPromise> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // create a new apps and return the newly created apps
    return await this.userappService.createUserapp(userapp, user.id);
  }

  @ApiTags('Client-Application')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // get all apps in the db
    const list = await this.userappService.findAllUserapps(user.id, role);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiTags('Client-Application')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<Userapp> {
    // find the app with this id
    const apps = await this.userappService.findOneUserapp(id, user.id, role);

    // if the apps doesn't exit in the db, throw a 404 error
    if (!apps) {
      throw new NotFoundException("This app doesn't exist");
    }

    // if apps exist, return apps
    return apps;
  }

  @ApiTags('Client-Application')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() userapp: UserappDto,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ): Promise<createPromise> {
    // check the role
    if (role === 'trainer') {
      throw new ForbiddenException('Your role is not a user');
    }
    // update not allowed once the applicatin been used
    const app = await Userapp.findOne({ where: { id } });
    if (!app || app.status !== null) {
      throw new NotFoundException("This app been used or doesn't exist");
    }
    // get the number of row affected and the updated userapp
    const {
      numberOfAffectedRows,
      updatedApplication,
      matches,
    } = await this.userappService.updateUserapp(id, userapp, user.id, role);

    // if the number of row affected is zero,
    // it means the app doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return the updated app
    return { createdUserapp: updatedApplication, matches };
  }

  @ApiTags('Client-Application')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ) {
    // delete the app with this id
    const deleted = await this.userappService.deleteUserapp(id, user.id, role);

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }

  @ApiTags('Get all matches')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get('matches/:userappId')
  async findMatches(
    @Param('userappId') userappId: number,
    @Req() req: Request & { res: Response },
  ) {
    // get all apps in the db
    const list = await this.userappService.findMatches(userappId);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  // @ApiResponse({ status: 200 })
  // @UseGuards(AuthGuard('jwt'))
  // @Get('allapps')
  // async findAllForAdmin(@Req() req) {
  //   if (req.user.role !== 'admin') {
  //     throw new NotFoundException('You are not an admin');
  //   }
  //   // get all apps in the db
  //   const list = await this.userappService.findAllForAdmin();
  //   const count = list.length;
  //   req.res.set('Access-Control-Expose-Headers', 'Content-Range');
  //   req.res.set('Content-Range', `0-${count}/${count}`);
  //   return list;
  // }
}
