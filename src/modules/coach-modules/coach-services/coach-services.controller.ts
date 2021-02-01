import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoachService } from './coach-service.entity';
import { CoachServicesService } from './coach-services.service';
import { CoachServiceDto } from './dto/coach-service.dto';

@ApiTags('Coach Service')
@ApiBearerAuth()
@Controller('coach-services')
export class CoachServicesController {
  constructor(private readonly coachServiceService: CoachServicesService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() service: CoachServiceDto,
    @Request() req,
  ): Promise<CoachService> {
    // get the number of row affected and the updated services
    const {
      numberOfAffectedRows,
      updatedCoachServices,
    } = await this.coachServiceService.update(id, service, req.user);

    // if the number of row affected is zero,
    // it means the services doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This services doesn't exist");
    }

    // return the updated services
    return updatedCoachServices;
  }
}
