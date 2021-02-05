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
    const list: any = await DietProgram.findAll({
      where: { userId: req.user.id },
      include: [DietProduct, Userapp],
    })
    .map((el) => el.get({ plain: true }));

    let listWithProfile = [];
    for (const prog of list) {
      const coachprofile = await CoachProfile.findOne({
        where: {
          userId: prog.coachId,
        },
      });
      listWithProfile.push({ ...prog, coachprofile });
    }
    const count = listWithProfile.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return listWithProfile;
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

    const plainProgData: any = progs.get({ plain: true });
    const coachprofile = await CoachProfile.findOne({
      where: {
        userId: plainProgData.coachId,
      },
    });
    const returnedData = { ...plainProgData, coachprofile };

    // if progs exist, return progs
    return returnedData;
  }
}
