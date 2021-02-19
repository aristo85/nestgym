import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { WorkoutProgramsService } from './workout-programs.service';

// @ApiTags('workout programs')
@ApiBearerAuth()
@Controller('workout-programs')
export class WorkoutProgramsController {
  constructor(private readonly workoutProgramService: WorkoutProgramsService) {}

  //   @UseGuards(AuthGuard('jwt'))
  //   @Post(':userappId')
  //   async create(
  //     @Body() workoutprogram: WorkoutProgramDto,
  //     @Request() req,
  //     @Param('userappId') userappId: number,
  //   ): Promise<WorkoutProgram> {
  //     // check the role
  //     if (req.user.role !== 'trainer') {
  //       throw new NotFoundException('Your role is not a trainer');
  //     }
  //     // create a new apps and return the newly created apps
  //     return await this.workoutProgramService.create(
  //       workoutprogram,
  //       userappId,
  //     );
  //   }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all progs in the db
    const list = await this.workoutProgramService.findAll();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }
}
