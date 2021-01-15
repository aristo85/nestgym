import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Requestedapp } from './coachapp.entity';
import { CoachappsService } from './coachapps.service';
import { RequestedappDto } from './dto/coachapp.dto';

@ApiTags('Request-Coach')
@ApiBearerAuth()
@Controller('coachapps')
export class CoachappsController {
  constructor(private readonly coachappappService: CoachappsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':coachId/:userappId')
  async create(
    @Request() req,
    @Param('coachId') coachId,
    @Param('userappId') userappId,
  ): Promise<Requestedapp> {
    let userapp = await this.coachappappService.findOne(userappId);
    console.log(userapp);
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
}
