import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  NotAcceptableException,
  MethodNotAllowedException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Roles, User } from 'src/modules/users/user.entity';
import { AuthUser, UserRole } from 'src/modules/users/users.decorator';
import { ApplicationRequestStatus, Requestedapp } from './coachapp.entity';
import { CoachappsService } from './coachapps.service';
import { CoachAnswerDto, RequestedappDto } from './dto/coachapp.dto';

interface stat {
  status: string;
}

@ApiBearerAuth()
@Controller('coach-requests')
export class CoachappsController {
  constructor(private readonly coachappService: CoachappsService) {}

  // request to hire a Trainer
  @ApiTags(
    'ClientRequest-ChosenCoach (Выбор тренера из списка матчинга клиентом)',
  )
  @UseGuards(AuthGuard('jwt'))
  @Post(':coachId/:userappId')
  async create(
    @Request() req: Request,
    @Param('coachId') coachId: number,
    @Param('userappId') userappId: number,
    @AuthUser() user: User,
  ): Promise<any> {
    const app = await this.coachappService.findApp(userappId, user.id);
    if (!app) {
      throw new NotFoundException('application not found');
    }

    // check if client requested this coach before
    const myCoaches = await Requestedapp.findOne({
      where: { coachId, userappId },
    });
    if (myCoaches) {
      throw new MethodNotAllowedException('you have requested this coach already!');
    }
    // check if number of requested applications exseeded maximum
    const myRequests = await Requestedapp.findAll({
      where: { userappId },
    });
    if (myRequests.length >= 3) {
      throw new NotAcceptableException(
        'number of app requests are exseeded, 3 maximum',
      );
    }
    // create a new apps and return the newly created apps
    let createdRequest = (
      await this.coachappService.createAppRequest(user.id, coachId, userappId)
    ).get();

    const returnedData = {
      ...createdRequest,
      requestLeft: 2 - myRequests.length,
    };
    return returnedData;
  }

  // get all requestedapps(offers) of a trainer
  @ApiTags('CoachRequests (Запросы приходящие тренеру)')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @AuthUser() user: User,
    @UserRole() role: Roles,
    @Req() req: Request & { res: Response },
  ) {
    // check the role
    if (role === 'user') {
      throw new ForbiddenException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // get all apps in the db
    const list = await this.coachappService.findAllCoachAppRequest(
      role === 'admin' ? null : user.id,
    );
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  // get all requestedapps(offers) by query
  @ApiTags('CoachRequests (Запросы приходящие тренеру)')
  @ApiQuery({ name: 'status', enum: ApplicationRequestStatus })
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get('query')
  async findByQuery(
    @AuthUser() user: User,
    @Query() query: { status: ApplicationRequestStatus },
    @Req() req: Request & { res: Response },
  ) {
    // check the role
    if (user.role === 'user') {
      throw new ForbiddenException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // get all apps in the db
    const list = await this.coachappService.findCoachAppRequestByQuery(
      user.id,
      query.status,
    );
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  // get all requestedapps(offers) by query
  @ApiTags('CoachRequests (Запросы приходящие тренеру)')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get('coach/activeapps')
  async findActiveApps(
    @AuthUser() user: User,
    @Req() req: Request & { res: Response },
  ) {
    // check the role
    if (user.role === 'user') {
      throw new NotFoundException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // get all apps in the db
    const list = await this.coachappService.findCoachActiveApps(user.id);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  //
  @ApiTags("Coach's response on request (Ответ тренера на запрос)")
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':userappId')
  async update(
    @Param('userappId') userappId: number,
    @Body() data: CoachAnswerDto,
    @AuthUser() user: User,
  ): Promise<Requestedapp[]> {
    // check the role
    if (user.role === 'user') {
      throw new NotFoundException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // check userappId
    const myRequest = await Requestedapp.findOne({
      where: {
        coachId: user.id,
        userappId,
      },
    });
    if (!myRequest) {
      throw new NotFoundException(
        'You dont have a request with this application',
      );
    }
    // get the number of row affected and the updated userapp
    const userapp = await this.coachappService.updateCoachRequest(
      userappId,
      user.id,
      data.status,
    );

    // return the updated app
    return userapp;
  }
}
