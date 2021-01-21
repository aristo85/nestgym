import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkoutProgramDto } from '../workout-programs/dto/workout-progiam.dto';
import { FullProgWorkoutDto } from './dto/full-progworkout.dto';
import { FullProgworkoutsService } from './full-progworkouts.service';
import { FullProgWorkout } from './full.progworkout.enity';

@ApiTags('workout programs')
@ApiBearerAuth()
@Controller('full-progworkouts')
export class FullProgworkoutsController {
  constructor(
    private readonly fullProgworkoutService: FullProgworkoutsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() templateData: FullProgWorkoutDto,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // create a new progs and return the newly created progs
    return await this.fullProgworkoutService.create(
      templateData,
      req.user.id,
    );
  }

@ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db
    const list = await this.fullProgworkoutService.findAll(req.user);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

@ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req): Promise<FullProgWorkout> {
    // find the progs with this id
    const progs = await this.fullProgworkoutService.findOne(id, req.user);

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }
}
