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
import { ApiBearerAuth, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type } from 'os';
import { UserappDto } from 'src/modules/userapps/userapp.dto';
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
  @ApiTags('Request-Chosen-Coach')
  @UseGuards(AuthGuard('jwt'))
  @Get(':coachId/:userappId')
  async create(
    @Request() req,
    @Param('coachId') coachId,
    @Param('userappId') userappId,
  ): Promise<Requestedapp> {
    // check if the the application been used
    let userapp = (await Userapp.findOne({ where: { id: userappId } })).get();
    if (userapp) {
      throw new NotFoundException('this application already active');
    }
    // create a new apps and return the newly created apps
    return await this.coachappappService.create(
      req.user.id,
      coachId,
      userappId,
    );
  }

  // get all requestedapps(offers) of a triner
  @ApiTags('Coach-Applications/Offers')
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
  @ApiTags('Coach-Applications/Offers')
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
