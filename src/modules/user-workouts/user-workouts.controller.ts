import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Op } from 'sequelize';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { WorkoutProgUpdateDto } from './dto/user-workout.dto';
import { UserWorkout } from './user-workout.entity';
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
    // find my programs
    const list = await FullProgWorkout.findAll({
      where: { userId: req.user.id },
      include: [WorkoutProgram],
    });

    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  // find one
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // find the apps with this id
    const apps = await FullProgWorkout.findOne({
      where: {
        id,
        userId: req.user.id,
      },
      include: [WorkoutProgram],
    });

    // if the apps doesn't exit in the db, throw a 404 error
    if (!apps) {
      throw new NotFoundException("This app doesn't exist");
    }

    // if apps exist, return apps
    return apps;
  }

  // updating workout weight
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':fullprogworkoutId')
  async update(
    @Param('fullprogworkoutId') fullprogworkoutId: number,
    @Body() data: WorkoutProgUpdateDto,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // check id
    const apps = await FullProgWorkout.findOne({
      where: { id: fullprogworkoutId },
    });

    // if the apps doesn't exit in the db, throw a 404 error
    if (!apps) {
      throw new NotFoundException("This program doesn't exist");
    }
    // first update the workouts weight
    const { dayDone, workoutList } = data;
    for (const workout of workoutList) {

      // check id
      const apps = await FullProgWorkout.findOne({
        where: { id: workout.id },
      });
      // if the apps doesn't exit in the db, throw a 404 error
      if (!apps) {
        throw new NotFoundException("wrong workout id(s)");
      }

      await WorkoutProgram.update(
        { weight: workout.lastWeight },
        {
          where: {
            id: workout.id,
          },
          returning: true,
        },
      );
    }
    // then update the day of training done by client
    await FullProgWorkout.update(
      { dayDone: dayDone },
      { where: { id: fullprogworkoutId }, returning: true },
    );

    // return the updated app
    return await FullProgWorkout.findOne({
      where: { id: fullprogworkoutId },
      include: [WorkoutProgram],
    });
  }
}
