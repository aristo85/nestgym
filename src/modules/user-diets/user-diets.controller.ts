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
import { DietProduct } from '../coach-modules/dietproducts/dietproduct.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { UserDietsService } from './user-diets.service';

@ApiTags('client Diet programs')
@ApiBearerAuth()
@Controller('user-diets')
export class UserDietsController {
  constructor(private readonly userDietService: UserDietsService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    // get all progs in the db and filter it with the array of user ids in clientIds
    const list = await DietProgram.findAll({
      where: { userId: req.user.id },
      include: [DietProduct],
    });
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
    const progs = await DietProgram.findOne({ where: { id } });

    // if the progs doesn't exit in the db, throw a 404 error
    if (!progs) {
      throw new NotFoundException("This program doesn't exist");
    }

    // if progs exist, return progs
    return progs;
  }
}
