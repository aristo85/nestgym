import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Requestedapp } from './coachapp.entity';
import { CoachappsService } from './coachapps.service';
import { CoachAnswerDto, RequestedappDto } from './dto/coachapp.dto';

type updData = [number, Userapp[]];
interface stat {
  status: string;
}

@ApiBearerAuth()
@Controller('coachapps')
export class CoachappsController {
  constructor(private readonly coachappappService: CoachappsService) {}

  // request to hire a Trainer
  @ApiTags('ClientRequest-ChosenCoach')
  @UseGuards(AuthGuard('jwt'))
  @Get(':coachId/:userappId')
  async create(
    @Request() req,
    @Param('coachId') coachId,
    @Param('userappId') userappId,
  ): Promise<any> {
    // check if the application been used
    let userapp = await Requestedapp.findOne({ where: { userappId } });
    if (userapp) {
      throw new NotFoundException('this application already active');
    }
    // check if client requested this coach before
    const myCoaches = await Requestedapp.findOne({
      where: { userId: req.user.id, coachId },
    });
    if (myCoaches) {
      throw new NotFoundException('you have requested this coach already!');
    }
    // check if number of requested applications exseeded maximum
    const myRequests = await Requestedapp.findAll({
      where: { userId: req.user.id },
    });
    if (myRequests.length >= 3) {
      throw new NotFoundException(
        'number of app requests are exseeded, 3 maximum',
      );
    }
    // create a new apps and return the newly created apps
    let createdRequest = (
      await this.coachappappService.create(req.user.id, coachId, userappId)
    ).get();

    const returnedData = {
      ...createdRequest,
      requestLeft: 3 - myRequests.length,
    };
    return returnedData;
  }

  // get all requestedapps(offers) of a triner
  @ApiTags('CoachApps')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    // check the role
    if (req.user.role === 'user') {
      throw new NotFoundException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // get all apps in the db
    const list = await this.coachappappService.findAll(req.user);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  //
  @ApiTags('CoachResponse-Accept/Reject/Coment-app')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':userappId')
  async update(
    @Param('userappId') userappId: number,

    @Body() data: CoachAnswerDto,
    @Request() req,
  ): Promise<updData> {
    // get the number of row affected and the updated userapp
    const userapp: updData = await this.coachappappService.update(
      userappId,
      data.status,
    );

    // return the updated app
    return userapp;
  }
}
