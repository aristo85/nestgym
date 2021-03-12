import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/users/user.entity';
import { AuthUser } from 'src/modules/users/users.decorator';
import { CoachService } from './coach-service.entity';
import { CoachServicesService } from './coach-services.service';
import { CoachServiceDto } from './dto/coach-service.dto';

@ApiTags('Coach Service (Услуги тренера)')
@ApiBearerAuth()
@Controller('coach-services')
export class CoachServicesController {
  constructor(private readonly coachServiceService: CoachServicesService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') coachServiceId: number,
    @Body() service: CoachServiceDto,
    @AuthUser() user: User,
  ): Promise<CoachService> {
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
      throw new NotFoundException("This service doesn't exist");
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
