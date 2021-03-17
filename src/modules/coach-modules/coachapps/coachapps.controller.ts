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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiTags('CoachRequests (Запросы приходящие тренеру)')
  @ApiOperation({ summary: 'Клиент подает запрос выбраному тренеру' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'userappId',
    required: true,
    description: 'Id заявки',
  })
  @ApiParam({
    name: 'coachId',
    required: true,
    description: 'Id тренера',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post(':coachId/:userappId')
  async create(
    @Param('coachId') coachId: number,
    @Param('userappId') userappId: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<any> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    const app = await this.coachappService.findApp(userappId, user.id);
    if (!app) {
      throw new NotFoundException('application not found');
    }

    // check if client requested this coach before
    const myCoaches = await Requestedapp.findOne({
      where: { coachId, userappId },
      raw: true,
      nest: true,
    });
    console.log(myCoaches);
    if (myCoaches) {
      throw new MethodNotAllowedException(
        'you have requested this coach already!',
      );
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
  @ApiOperation({
    summary: 'Получение всех запросов тренеру',
    description: 'Если Админ то возвращает всех запросов из БД',
  })
  @ApiResponse({ status: 200, description: 'Массив запросов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  // @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
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
  @ApiOperation({ summary: 'Получение запросов по статусу' })
  @ApiResponse({ status: 200, description: 'Массив запросов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiQuery({
    name: 'status',
    description: 'Статус запроса',
    enum: ApplicationRequestStatus,
  })
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
        "your role is 'user', users dont have access to coach's info.! ",
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
  @ApiOperation({ summary: 'Получение всех активных заявок тренера' })
  @ApiResponse({ status: 200, description: 'Массив запросов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get('coach/activeapps')
  async findActiveApps(
    @AuthUser() user: User,
    @Req() req: Request & { res: Response },
  ) {
    // check the role
    if (user.role === 'user') {
      throw new ForbiddenException(
        "your role is 'user', users dont have access to coach's info.! ",
      );
    }
    // get all apps in the db
    const list = await this.coachappService.findCoachActiveApps(user.id, true);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  //
  @ApiTags('CoachRequests (Запросы приходящие тренеру)')
  @ApiOperation({ summary: 'Ответ тренера на запрос' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'userappId',
    required: true,
    description: 'Id заявки',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':userappId')
  async update(
    @Param('userappId') userappId: number,
    @Body() data: CoachAnswerDto,
    @AuthUser() user: User,
  ): Promise<Requestedapp[]> {
    // check the role
    if (user.role === 'user') {
      throw new ForbiddenException(
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
    const coachRequest = await this.coachappService.updateCoachRequest(
      userappId,
      user.id,
      data.status,
    );

    // return the updated app
    return coachRequest;
  }
}
