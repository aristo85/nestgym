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
import { WorkoutProgramDto } from '../workout-programs/dto/workout-progiam.dto';
import { FullProgWorkoutDto, FullProgWorkoutUpdateDto } from './dto/full-progworkout.dto';
import { FullProgworkoutsService } from './full-progworkouts.service';
import { FullProgWorkout } from './full.progworkout.enity';

@ApiTags('workout full programs')
@ApiBearerAuth()
@Controller('full-progworkouts')
export class FullProgworkoutsController {
  constructor(
    private readonly fullProgworkoutService: FullProgworkoutsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() fullprog: FullProgWorkoutDto,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // check if the cliet list is empty
    if (fullprog.clientIds.length < 1) {
      throw new NotFoundException('You havent chosen any client');
    }
    // check if the client have this program already
    let prg = await FullProgWorkout.findAll({
      where: { userId: [...fullprog.clientIds], coachId: req.user.id  },
    });
    if (prg.length > 0) {
      throw new NotFoundException(
        'Some or all of the clients are have program already!',
      );
    }
    // create a new progs and return the newly created progs
    return await this.fullProgworkoutService.create(fullprog, req.user.id);
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
  async findOne(
    @Param('id') id: number,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // find the progs with this id
    const progs = await this.fullProgworkoutService.findOne(id, req.user);

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
    // delete the app with this id
    const deleted = await this.fullProgworkoutService.delete(id, req.user.id);

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
    @Body() data: FullProgWorkoutUpdateDto,
    @Request() req,
  ): Promise<FullProgWorkout> {
    // get the number of row affected and the updated Prog
    return await this.fullProgworkoutService.update(id, data, req.user.id);
  }
}
