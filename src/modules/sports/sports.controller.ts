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
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
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
  async create(
    @Body() sport: SportDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Sport> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // create a new sport and return the newly created sport
    return await this.sportService.createSport(sport, user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request & { res: Response }) {
    // get all sports in the db
    const list = await this.sportService.findAllSports();
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
    @UserRole() role: Roles,
  ): Promise<Sport> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the sport with this id
    const sport = await this.sportService.findOneSport(id);

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
    @UserRole() role: Roles,
  ): Promise<Sport> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // get the number of row affected and the updated sport
    const {
      numberOfAffectedRows,
      updatedSport,
    } = await this.sportService.updateSport(id, sport);

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
  async remove(
    @Param('id') id: number,
    @UserRole() role: Roles,
  ) {
    // check the role
    if (role !== 'admin') {
      throw new NotFoundException('Your role is not an admin');
    }
    // delete the sport with this id
    const deleted = await this.sportService.deleteSport(id);

    // if the number of row affected is zero,
    // then the sport doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This sport doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
