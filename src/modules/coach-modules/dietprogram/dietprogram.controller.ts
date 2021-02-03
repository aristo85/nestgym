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
import { Requestedapp } from '../coachapps/coachapp.entity';
import { DietProgram } from './dietprogram.entity';
import { DietprogramService } from './dietprogram.service';
import { DietProgramDto, DietProgramUpdateDto } from './dto/dietprogram.dto';

@ApiTags('diet programs')
@ApiBearerAuth()
@Controller('dietprogram')
export class DietprogramController {
  constructor(private readonly dietProgramService: DietprogramService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: DietProgramDto,
    @Request() req,
  ): Promise<DietProgram> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // check if the userappIds list is empty
    if (data.userappIds.length < 1) {
      throw new NotFoundException('You havent chosen any application');
    }
    // check if applications are exists
    const myRequests = await Requestedapp.findAll({
      where: { userappId: [...data.userappIds], coachId: req.user.id },
    });
    if (myRequests.length !== data.userappIds.length) {
      throw new NotFoundException('some of the Apps are not exist');
    }

    // create a new prog and return the newly created progs
    return await this.dietProgramService.create(data, req.user.id, myRequests);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db
    const list = await this.dietProgramService.findAll(req.user);
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
    const progs = await this.dietProgramService.findOne(id, req.user);

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
    const deleted = await this.dietProgramService.delete(id, req.user.id);

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
    @Body() data: DietProgramUpdateDto,
    @Request() req,
  ): Promise<DietProgram> {
    // check id
    const prog = await this.dietProgramService.findOne(id, req.user);
    if (!prog) {
      throw new NotFoundException("This program doesn't exist");
    }
    // get the number of row affected and the updated Prog
    return await this.dietProgramService.update(id, data, req.user.id);
  }
}
