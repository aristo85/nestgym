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
import { CoachProfile } from './coach-profile.entity';
import { CoachProfilesService } from './coach-profiles.service';
import { CoachProfileDto } from './dto/coach-profile.dto';
@Controller('coach-profiles')
@ApiTags('Coach Profile')
@ApiBearerAuth()
@Controller('coachprofiles')
export class CoachProfilesController {
  constructor(private readonly coachProfileService: CoachProfilesService) {}

  //   @ApiResponse({ status: 200 })
  //   @UseGuards(AuthGuard('jwt'))
  //   @Get()
  //   async findAll(@Req() req) {
  //     // get all profiles in the db
  //     const list = await this.coachProfileService.findAll(req.user.id);
  //     const count = list.length;
  //     req.res.set('Access-Control-Expose-Headers', 'Content-Range');
  //     req.res.set('Content-Range', `0-${count}/${count}`);
  //     return list;
  //   }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findOne(@Req() req): Promise<CoachProfile> {
    // find the profiles with this id
    const profiles = await this.coachProfileService.findOne(req.user.id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profiles) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profiles;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() profile: CoachProfileDto,
    @Request() req,
  ): Promise<CoachProfile> {
    // check the role
    if (req.user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // check if user already has a profile
    const isProfile = await this.coachProfileService.findOne(req.user.id);
    if (isProfile) {
      throw new NotFoundException('This User already has a profile');
    }
    // create a new profiles and return the newly created profiles
    return await this.coachProfileService.create(profile, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() profile: CoachProfileDto,
    @Request() req,
  ): Promise<CoachProfile> {
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedprofile,
    } = await this.coachProfileService.update(id, profile, req.user.id);

    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedprofile;
  }

  //   @UseGuards(AuthGuard('jwt'))
  //   @Delete(':id')
  //   async remove(@Param('id') id: number, @Req() req) {
  //     // delete the profile with this id
  //     const deleted = await this.coachProfileService.delete(id, req.user.id);

  //     // if the number of row affected is zero,
  //     // then the profile doesn't exist in our db
  //     if (deleted === 0) {
  //       throw new NotFoundException("This profile doesn't exist");
  //     }

  //     // return success message
  //     return 'Successfully deleted';
  //   }
}
