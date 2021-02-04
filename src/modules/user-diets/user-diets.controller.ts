import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { DietProduct } from '../coach-modules/dietproducts/dietproduct.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { UserWorkout } from '../user-workouts/user-workout.entity';
import { Userapp } from '../userapps/userapp.entity';
import { User } from '../users/user.entity';
import { UserDietsService } from './user-diets.service';

@ApiTags('client Diet programs')
@ApiBearerAuth()
@Controller('user-diets')
export class UserDietsController {
  constructor(private readonly userDietService: UserDietsService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db and filter it with the array of user ids in clientIds
    const list = await DietProgram.findAll({
      where: { userId: req.user.id },
      include: [DietProduct, Userapp],
    });
    // let newList = [];
    // for (const prog of list) {
    //   // let rawProg: any = prog.get();
    //   console.log(prog);
    //   const coachprofile = await CoachProfile.findOne({
    //     where: { id: prog.coachId },
    //     include: [CoachService],
    //   });
    //   newList.push({ prog, coachprofile });
    // }
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req): Promise<DietProgram> {
    // find the progs with this id
    const progs = await DietProgram.findOne({
      where: { id },
      include: [
        DietProduct,
        {
          model: Userapp,
          include: [
            Requestedapp,
            {
              model: FullProgWorkout,
              include: [{ model: WorkoutProgram }],
            },
            UserWorkout,
          ],
        },
      ],
    });

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }
}
