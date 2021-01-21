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
import { DietProgram } from './dietprogram.entity';
import { DietprogramService } from './dietprogram.service';
import { DietProgramDto } from './dto/dietprogram.dto';

@ApiTags('diet programs')
@ApiBearerAuth()
@Controller('dietprogram')
export class DietprogramController {
  constructor(
    private readonly dietProgramService: DietprogramService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() templateData: DietProgramDto,
    @Request() req,
  ): Promise<DietProgram> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // create a new progs and return the newly created progs
    return await this.dietProgramService.create(templateData, req.user.id);
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
  async findOne(
    @Param('id') id: number,
    @Request() req,
  ): Promise<DietProgram> {
    // find the progs with this id
    const progs = await this.dietProgramService.findOne(id, req.user);

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }
}
