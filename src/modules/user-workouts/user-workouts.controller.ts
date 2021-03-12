import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
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
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { Userapp } from '../userapps/userapp.entity';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { UserWorkoutDto, WorkoutProgUpdateDto } from './dto/user-workout.dto';
import { UserWorkout } from './user-workout.entity';
import { UserWorkoutsService } from './user-workouts.service';

@ApiTags('client workout programs (Программы тренировок клиента)')
@ApiBearerAuth()
@Controller('user-workouts')
export class UserWorkoutsController {
  constructor(private readonly userWorkoutService: UserWorkoutsService) {}

  // updating workout weight
  @ApiOperation({ summary: 'Создание записи тренировки' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'fullprogworkoutId',
    required: true,
    description: 'Id программы',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post(':fullprogworkoutId')
  async create(
    @Param('fullprogworkoutId') fullprogworkoutId: number,
    @Body() data: UserWorkoutDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<UserWorkout> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check id
    const prog = (
      await FullProgWorkout.findOne({
        where: { id: fullprogworkoutId, userId: user.id },
      })
    )?.get({ plain: true }) as (FullProgWorkout | undefined);
    // if the prog doesn't exit in the db, throw a 404 error
    if (!prog) {
      throw new NotFoundException(
        "This program doesn't exist, or not your program",
      );
    }

    // return the created workouts
    return await this.userWorkoutService.createUserWorkout(
      data,
      fullprogworkoutId,
      user.id,
      prog.userappId,
    );
  }

  @ApiOperation({
    summary: 'Получение всех записи клиента',
  })
  @ApiResponse({ status: 200, description: 'Массив записей' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  // @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ) {
    // check the role
    if (role === 'trainer') {
      throw new ForbiddenException('Your role is not a user');
    }
    // find my programs
    const list = await FullProgWorkout.findAll({
      where: { userId: user.id },
      include: [
        { model: UserWorkout },
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
  @ApiOperation({ summary: 'Получение записи по id' })
  @ApiResponse({ status: 200, description: 'Найденная запись' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id записи',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<FullProgWorkout> {
    // find the apps with this id
    const apps = await FullProgWorkout.findOne({
      where: {
        id,
        userId: user.id,
      },
      include: [
        { model: UserWorkout },
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
