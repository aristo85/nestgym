import {
  Body,
  Controller,
  createParamDecorator,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/users/user.entity';
import { AuthUser } from 'src/modules/users/users.decorator';
import { CoachService } from './coach-service.entity';
import { CoachServicesService } from './coach-services.service';
import { CoachServiceDto } from './dto/coach-service.dto';
import { CoachServicesDto } from './dto/coach-services.dto';

@ApiTags('Coach Service')
@ApiBearerAuth()
@Controller('coach-services')
export class CoachServicesController {
  constructor(private readonly coachServiceService: CoachServicesService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':coach-service-id')
  async update(
    @Param('coach-service-id') coachServiceId: number,
    @Body() service: CoachServiceDto,
    @Request() req: Request,
    @AuthUser() user: User
  ): Promise<CoachService> {
    // get the number of row affected and the updated services
    const {
      numberOfAffectedRows,
      updatedCoachServices,
    } = await this.coachServiceService.updateCoachService(coachServiceId, service, user);

    // if the number of row affected is zero,
    // it means the services doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This services doesn't exist");
    }

    // return the updated services
    return updatedCoachServices;
  }

}
