import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SportDto } from './dto/sport.dto';
import { Sport } from './sport.entity';
import { SportsService } from './sports.service';

@ApiTags('Given SportType List')
@ApiBearerAuth()
@Controller('sports')
export class SportsController {
  constructor(private readonly sportService: SportsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() sport: SportDto, @Request() req): Promise<Sport> {
    // check the role
    if (req.user.role !== 'admin') {
      throw new NotFoundException('Your role is not an admin');
    }
    // create a new sport and return the newly created sport
    return await this.sportService.create(sport, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    // get all sports in the db
    const list = await this.sportService.findAll();
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req): Promise<Sport> {
    // find the sport with this id
    const sport = await this.sportService.findOne(id);

    // if the sport doesn't exit in the db, throw a 404 error
    if (!sport) {
      throw new NotFoundException("This sport doesn't exist");
    }
    // if sport exist, return sport
    return sport;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() sport: SportDto,
    @Request() req,
  ): Promise<Sport> {
      // check the role
    if (req.user.role !== 'admin') {
        throw new NotFoundException('Your role is not an admin');
      }
    // get the number of row affected and the updated sport
    const {
      numberOfAffectedRows,
      updatedSport,
    } = await this.sportService.update(id, sport);

    // if the number of row affected is zero,
    // it means the sport doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This sport doesn't exist");
    }

    // return the updated sport
    return updatedSport;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
      // check the role
    if (req.user.role !== 'admin') {
        throw new NotFoundException('Your role is not an admin');
      }
    // delete the sport with this id
    const deleted = await this.sportService.delete(id);

    // if the number of row affected is zero,
    // then the sport doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This sport doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
