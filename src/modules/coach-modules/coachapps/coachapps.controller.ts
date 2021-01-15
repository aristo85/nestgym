import { Body, Controller, NotFoundException, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Requestedapp } from './coachapp.entity';
import { CoachappsService } from './coachapps.service';

@ApiTags('Coach-Application')
@ApiBearerAuth()
@Controller('coachapps')
export class CoachappsController {
  constructor(private readonly coachappappService: CoachappsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() data, @Request() req): Promise<Requestedapp> {
      let userapp = await this.coachappappService.findOne(data.userappId)
      console.log(userapp)
      if(userapp) {
          throw new NotFoundException('this application already active')
      }
    // create a new apps and return the newly created apps
    return await this.coachappappService.create(
      req.user.id,
      data.coachId,
      data.userappId,
    );
  }
}
