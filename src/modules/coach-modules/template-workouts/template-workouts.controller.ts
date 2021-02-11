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
import {
  TemplateWorkoutDto,
  TemplateWorkoutUpdateDto,
} from './dto/template-workout.dto';
import { TemplateWorkout } from './template-workout.entity';
import { TemplateWorkoutsService } from './template-workouts.service';

@ApiTags('Template Workout Programs')
@ApiBearerAuth()
@Controller('template-workouts')
export class TemplateWorkoutsController {
  constructor(
    private readonly templateworkoutService: TemplateWorkoutsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() template: TemplateWorkoutDto,
    @Request() req,
  ): Promise<TemplateWorkout> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // create a new progs and return the newly created progs
    return await this.templateworkoutService.create(template, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db
    const list = await this.templateworkoutService.findAll(req.user);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Request() req,
  ): Promise<TemplateWorkout> {
    // find the progs with this id
    const progs = await this.templateworkoutService.findOne(id, req.user);

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
     // check the role
     if (req.user.role === 'user') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // delete the app with this id
    const deleted = await this.templateworkoutService.delete(id, req.user.id);

    // if the number of row affected is zero,
    // then the app doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This app doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: TemplateWorkoutUpdateDto,
    @Request() req,
  ): Promise<TemplateWorkout> {
     // check the role
     if (req.user.role === 'user') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // get the number of row affected and the updated Prog
    return await this.templateworkoutService.update(id, data, req.user);
  }
}
