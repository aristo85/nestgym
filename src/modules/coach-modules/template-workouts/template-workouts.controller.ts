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
import { Roles, User } from 'src/modules/users/user.entity';
import { AuthUser, UserRole } from 'src/modules/users/users.decorator';
import {
  TemplateWorkoutDto,
  TemplateWorkoutUpdateDto,
} from './dto/template-workout.dto';
import { TemplateWorkout } from './template-workout.entity';
import { TemplateWorkoutsService } from './template-workouts.service';

@ApiTags('Template Workout Programs (Шаблоны для программ тренеровок)')
@ApiBearerAuth()
@Controller('template-workouts')
export class TemplateWorkoutsController {
  constructor(
    private readonly templateworkoutService: TemplateWorkoutsService,
  ) {}

  @ApiOperation({ summary: 'Создание шаблона тренировки' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() template: TemplateWorkoutDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<TemplateWorkout> {
    // check the role
    if (role !== 'trainer') {
      throw new ForbiddenException('Your role is not a trainer');
    }
    // create a new progs and return the newly created progs
    return await this.templateworkoutService.createWorkoutTemplate(
      template,
      user.id,
    );
  }

  @ApiOperation({
    summary: 'Получение всех шаблонов тренировки тренера',
  })
  @ApiResponse({ status: 200, description: 'Массив шаблонов' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Req() req: Request & { res: Response },
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // get all progs in the db
    const list = await this.templateworkoutService.findAllWorkoutTemplates(
      role === 'admin' ? null : user.id,
    );
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiOperation({ summary: 'Получение шаблона тренировки по id' })
  @ApiResponse({ status: 200, description: 'Найденный шаблон' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id шаблона',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<TemplateWorkout> {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // find the progs with this id
    const progs = await this.templateworkoutService.findOneWorkoutTemplate(
      id,
      role === 'admin' ? null : user.id,
    );

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }

  @ApiOperation({ summary: 'Удаление шаблона тренировки' })
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id шаблона',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // delete the app with this id
    const deleted = await this.templateworkoutService.deleteWorkoutTemplate(
      id,
      role === 'admin' ? null : user.id,
    );

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }

  @ApiOperation({ summary: 'Редактирование шаблона тренировки' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id шаблона',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: TemplateWorkoutUpdateDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<TemplateWorkout[]> {
    // check the role
    if (role !== 'trainer' && role !== 'admin') {
      throw new ForbiddenException('User must be trainer or admin');
    }
    // check id
    const prog = await this.templateworkoutService.findOneWorkoutTemplate(
      id,
      role === 'admin' ? undefined : user.id,
    );
    if (!prog) {
      throw new NotFoundException("This program doesn't exist");
    }
    // get the number of row affected and the updated Prog
    return await this.templateworkoutService.updateWorkoutTemplate(
      id,
      data,
      role === 'admin' ? undefined : user.id,
    );
  }
}
