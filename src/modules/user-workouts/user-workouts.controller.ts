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
  async checkAndGet(@Request() req) {
    // find my programs
    // get all progs in the db and filter it with the array of user ids in clientIds
    const list = await FullProgWorkout.findAll({
      where: { clientIds: { [Op.contains]: [req.user.id] } },
    });

    // get all workouts that made for me by the trainer
    for (const prog of list) {
      let onlyProg: any = prog.get();
      // check if first time using this programm, if so create diary/daybook
      const myDayBook = await this.userWorkoutService.findAll(
        req.user,
        onlyProg.id,
      );
      if (myDayBook.length < 1) {
        let myWorkoutList = await WorkoutProgram.findAll<WorkoutProgram>({
          where: { fullprogworkoutId: onlyProg.id },
        });
        for (const workout of myWorkoutList) {
          await this.userWorkoutService.create(
            { lastWeight: workout.weight },
            workout.id, //workoutprogramId
            onlyProg.id, //fullprogworkoutId
            req.user.id,
          );
        }
      }
    }
    // return list of full programs with workout list and user editable workout weights
    const myList = await FullProgWorkout.findAll({
      where: { clientIds: { [Op.contains]: [req.user.id] } },
      include: [
        {
          model: UserWorkout,
          attributes: ['id', 'lastWeight', 'workoutprogramId'],
          include: [WorkoutProgram],
        },
      ],
    });
    const count = myList.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return myList;
  }

  // updating workout weight
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':userworkoutId')
  async update(
    @Param('userworkoutId') userworkoutId: number,
    @Body() data,
    @Request() req,
  ): Promise<UserWorkout> {
    // get the number of row affected and the updated workout
    const {
      numberOfAffectedRows,
      updatedworkout,
    } = await this.userWorkoutService.update(userworkoutId, data);

    // if the number of row affected is zero,
    // it means the app doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return the updated app
    return updatedworkout;
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
