import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { Userapp } from '../userapps/userapp.entity';
import { User } from '../users/user.entity';
import { AuthUser } from '../users/users.decorator';
import { RetDiet, UserDietsService } from './user-diets.service';

@ApiTags('client Diet programs (Программы диеты клиента)')
@ApiBearerAuth()
@Controller('user-diets')
export class UserDietsController {
  constructor(private readonly userDietService: UserDietsService) {}

  @ApiOperation({
    summary: 'Получение всех програм диет клиента',
  })
  @ApiResponse({ status: 200, description: 'Массив програм' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  // @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @AuthUser() user: User,
    @Req() req: Request & { res: Response },
  ): Promise<RetDiet[]> {
    // get all progs in the db and filter it with the array of user ids in clientIds
    const list = await DietProgram.findAll({
      raw: true,
      nest: true,
      where: { userId: user.id },
      include: [Userapp],
    });
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({ summary: 'Получение программы диеты по id' })
  @ApiResponse({ status: 200, description: 'Найденная программа' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  // @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id программы',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<RetDiet> {
    // find the progs with this id
    const diet = await DietProgram.findOne({
      raw: true,
      nest: true,
      where: { id, userId: user.id },
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
    // let dataJson = isJson(diet.days);
    // while (isJson(dataJson)) {
    //   dataJson = isJson(dataJson);
    // }

    return { ...diet, coachProfile };
  }
}
