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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Op } from 'sequelize';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { UserWorkoutsService } from './user-workouts.service';

@ApiTags('client workout programs')
@ApiBearerAuth()
@Controller('user-workouts')
export class UserWorkoutsController {
  constructor(private readonly userWorkoutService: UserWorkoutsService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db and filter it with the array of user ids in clientIds
    const list = await FullProgWorkout.findAll({
      where: { clientIds: { [Op.contains]: [req.user.id] } },
      include: [WorkoutProgram],
    });
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  //   @ApiResponse({ status: 200 })
  //     @UseGuards(AuthGuard('jwt'))
  //     @Get(':id')
  //     async findOne(@Param('id') id: number, @Request() req): Promise<FullProgWorkout> {
  //       // find the progs with this id
  //       const progs = await this.userWorkoutService.findOne(id, req.user);

  //       // if the progs doesn't exit in the db, throw a 404 error
  //       if (!progs) {
  //         throw new NotFoundException("This program doesn't exist");
  //       }

  //       // if progs exist, return progs
  //       return progs;
  //     }
}
