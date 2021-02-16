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
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { isJson } from '../coach-modules/dietprogram/dietprogram.service';
import { Userapp } from '../userapps/userapp.entity';
import { RetDiet, UserDietsService } from './user-diets.service';

@ApiTags('client Diet programs')
@ApiBearerAuth()
@Controller('user-diets')
export class UserDietsController {
  constructor(private readonly userDietService: UserDietsService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req): Promise<RetDiet[]> {
    // get all progs in the db and filter it with the array of user ids in clientIds
    const list = await DietProgram.findAll({
      raw: true,
      nest: true,
      where: { userId: req.user.id },
      include: [Userapp],
    }).map(async (el) => {
      // add coach profile
      const coachProfile = await CoachProfile.findOne({
        where: {
          userId: el.coachId,
        },
      });
      // transforming json days to object
      let dataJson = isJson(el.days);
      while (isJson(dataJson)) {
        dataJson = isJson(dataJson);
      }
      return { ...el, days: dataJson, coachProfile };
    });

    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req): Promise<RetDiet> {
    // find the progs with this id
    const diet = await DietProgram.findOne({
      raw: true,
      nest: true,
      where: { id, userId: req.user.id },
      include: [
        {
          model: Userapp,
        },
      ],
    });

    // if the diet doesn't exit in the db, throw a 404 error
    if (!diet) {
      throw new NotFoundException("This program doesn't exist");
    }

    const coachProfile = await CoachProfile.findOne({
      where: {
        userId: diet.coachId,
      },
    });

    // check the json
    let dataJson = isJson(diet.days);
    while (isJson(dataJson)) {
      dataJson = isJson(dataJson);
    }

    return { ...diet, days: dataJson, coachProfile };
  }
}
