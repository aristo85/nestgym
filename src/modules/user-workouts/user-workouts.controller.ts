import {
  Body,
  Controller,
  Delete,
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
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { Userapp } from '../userapps/userapp.entity';
import { UserWorkoutDto, WorkoutProgUpdateDto } from './dto/user-workout.dto';
import { UserWorkout } from './user-workout.entity';
import { UserWorkoutsService } from './user-workouts.service';

@ApiTags('client workout programs')
@ApiBearerAuth()
@Controller('user-workouts')
export class UserWorkoutsController {
  constructor(private readonly userWorkoutService: UserWorkoutsService) {}

  // updating workout weight
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Post(':fullprogworkoutId')
  async create(
    @Param('fullprogworkoutId') fullprogworkoutId: number,
    @Body() data: UserWorkoutDto,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // check id
    const prog: any = (
      await FullProgWorkout.findOne({
        where: { id: fullprogworkoutId, userId: req.user.id },
      })
    )?.get({ plain: true });
    // if the prog doesn't exit in the db, throw a 404 error
    if (!prog) {
      throw new NotFoundException(
        "This program doesn't exist, or not your program",
      );
    }

    // return the created workouts
    return await this.userWorkoutService.create(
      data,
      fullprogworkoutId,
      req.user,
      prog.userappId,
    );
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // check the role
    if (req.user.role === 'trainer') {
      throw new NotFoundException('Your role is not a user');
    }
    // find my programs
    const list = await FullProgWorkout.findAll({
      where: { userId: req.user.id },
      include: [
        { model: WorkoutProgram, include: [UserWorkout] },
        {
          model: Userapp,
        },
      ],
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
      include: [
        { model: WorkoutProgram, include: [UserWorkout] },
        {
          model: Userapp,
        },
      ],
    });

    // if the apps doesn't exit in the db, throw a 404 error
    if (!apps) {
      throw new NotFoundException("This app doesn't exist");
    }

    // if apps exist, return apps
    return apps;
  }

  // // ////////TEST
  // @UseGuards(AuthGuard('jwt'))
  // @Delete(':id')
  // async remove(@Param('id') id: number, @Request() req) {
  //   // delete the app with this id
  //   const deleted = await UserWorkout.destroy({ where: { id } });

  //   // if the number of row affected is zero,
  //   // then the app doesn't exist in our db
  //   if (deleted === 0) {
  //     throw new NotFoundException("This app doesn't exist");
  //   }

  //   // return success message
  //   return 'Successfully deleted';
  // }
}
