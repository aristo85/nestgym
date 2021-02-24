import {
  Body,
  Controller,
  createParamDecorator,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Op } from 'sequelize';
import { User } from 'src/modules/users/user.entity';
import { AuthUser } from 'src/modules/users/users.decorator';
import { CoachProfile } from '../coach-profiles/coach-profile.entity';
import { CoachService } from './coach-service.entity';
import { CoachServicesService } from './coach-services.service';
import { CoachServiceDto } from './dto/coach-service.dto';
import { CoachServicesDto } from './dto/coach-services.dto';

@ApiTags('Coach Service')
@ApiBearerAuth()
@Controller('coach-services')
export class CoachServicesController {
  constructor(private readonly coachServiceService: CoachServicesService) { }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') coachServiceId: number,
    @Body() service: CoachServiceDto,
    @AuthUser() user: User,
  ): Promise<CoachService> {
    console.log(coachServiceId);
    // get the number of row affected and the updated services
    const {
      numberOfAffectedRows,
      updatedCoachServices,
    } = await this.coachServiceService.updateCoachService(
      coachServiceId,
      service,
      user,
    );

    // if the number of row affected is zero,
    // it means the services doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This services doesn't exist");
    }

    // return the updated services
    return updatedCoachServices;
  }

  //////////////////////TEST
  // @ApiResponse({ status: 200 })
  // @UseGuards(AuthGuard('jwt'))
  // @Get(':id')
  // async findAll(
  //   @Req() req: Request & { res: Response },
  //   @Param('id') profId: number,
  //   // @AuthUser() user: User,
  //   // @UserRole() role: Roles,
  // ) {
  //   const userapp = { sportTypes: [], serviceTypes: [] }
  //   // get all apps in the db
  //   return await CoachProfile.findAll({
  //     // where: { id: profId },
  //     include: [{
  //       model: CoachService, where: {
  //         [Op.or]: [
  //           { sportType: userapp.sportTypes },
  //           { serviceType: userapp.serviceTypes }
  //         ]
  //       }
  //     }],
  //   });
    // const count = list.length;
    // req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    // req.res.set('Content-Range', `0-${count}/${count}`);
    // return list;
  // }
}
