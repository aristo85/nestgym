import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { Roles, User } from 'src/modules/users/user.entity';
import { AuthUser, UserRole } from 'src/modules/users/users.decorator';
import {
  FullProgWorkoutDto,
  FullProgWorkoutUpdateDto,
} from './dto/full-progworkout.dto';
import { FullProgworkoutsService } from './full-progworkouts.service';
import { FullProgWorkout } from './full.progworkout.enity';

@ApiTags('workout programs (Программы тренировок, созданные тренером)')
@ApiBearerAuth()
@Controller('full-progworkouts')
export class FullProgworkoutsController {
  constructor(
    private readonly fullProgworkoutService: FullProgworkoutsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Создание программы тренировки' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @Post()
  async create(
    @Body() fullprog: FullProgWorkoutDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<FullProgWorkout[]> {
    // check the role
    if (role !== 'trainer') {
      throw new ForbiddenException('Your role is not a trainer');
    }
    // check if the userappIds list is empty
    if (fullprog.userappIds.length < 1) {
      throw new NotFoundException('You havent chosen any application');
    }
    // check if applications are exists
    const myRequests = await Userapp.findAll({
      where: { id: fullprog.userappIds, coachId: user.id },
    });
    if (myRequests.length !== fullprog.userappIds.length) {
      throw new NotFoundException('some of the Apps are not exist');
    }

    // create a new prog and return the newly created progs
    return await this.fullProgworkoutService.createFullProgWorkout(
      fullprog,
      user.id,
      myRequests,
    );
  }

  @ApiOperation({
    summary: 'Получение всех програм тренировки тренера',
  })
  @ApiResponse({ status: 200, description: 'Массив програм' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  // @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role === 'user') {
      throw new ForbiddenException(
        "your role is 'user', users dont have access to coaches info.! ",
      );
    }
    // get all progs in the db
    const list = await this.fullProgworkoutService.findAllFullProgWorkouts(
      user.id,
      role,
    );
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({ summary: 'Получение программы тренировки по id' })
  @ApiResponse({ status: 200, description: 'Найденная программа' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
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
    @UserRole() role: Roles,
  ): Promise<FullProgWorkout> {
    // find the progs with this id
    const progs = await this.fullProgworkoutService.findOneFullProgWorkout(
      id,
      user.id,
      role,
    );

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }

  @ApiOperation({ summary: 'Удаление программы тренировки' })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id программы',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check id
    const prog = await this.fullProgworkoutService.findOneFullProgWorkout(
      id,
      user.id,
      role,
    );
    if (!prog) {
      throw new NotFoundException(
        "This program doesn't exist or you are a user",
      );
    }
    // delete the app with this id
    const deleted = await this.fullProgworkoutService.deleteFullProgWorkout(
      id,
      user.id,
    );

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This program doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }

  @ApiOperation({ summary: 'Редактирование программы тренировки' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  // @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id программы',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: FullProgWorkoutUpdateDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<FullProgWorkout[]> {
    // check id
    const prog = await this.fullProgworkoutService.findOneFullProgWorkout(
      id,
      user.id,
      role,
    );
    if (!prog) {
      throw new NotFoundException("This program doesn't exist");
    }
    // get the number of row affected and the updated Prog
    return await this.fullProgworkoutService.updateFullProgWorkout(
      id,
      data,
      user.id,
    );
  }
}
