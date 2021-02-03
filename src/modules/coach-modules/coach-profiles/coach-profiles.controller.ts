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
import {
  CoachProfileDto,
  CoachProfileUpdateDto,
} from './dto/coach-profile.dto';

@Controller('coach-profiles')
@ApiBearerAuth()
export class CoachProfilesController {
  constructor(private readonly coachProfileService: CoachProfilesService) {}

  // for the admin
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put('admin/update/:id')
  async updateFromAdmin(
    @Param('id') id: number,
    @Body() profile: any,
    @Request() req,
  ): Promise<CoachProfile> {
    // first update services
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedprofile,
    } = await this.coachProfileService.updateFromAdmin(id, profile, req.user);
    console.log('hi');
    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedprofile;
  }

  @ApiTags('Coach Profile')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req) {
    if (req.user.role === 'user') {
      throw new NotFoundException('your role is "user"');
    }
    // get all profiles in the db
    const list = await this.coachProfileService.findAll(req.user);
    const count = list.length;
    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiTags('Coach Profile')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req,
  ): Promise<CoachProfile> {
    // find the profiles with this id
    const profile = await this.coachProfileService.findOne(req.user, id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profile) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profile;
  }

  @ApiTags('Coach Profile')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get('coach/myprofile')
  async findMyProfile(@Request() req): Promise<CoachProfile> {
    // find the profiles with this id
    const profile = await this.coachProfileService.findMyProfile(req.user.id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profile) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profile;
  }

  @ApiTags('Coach Profile')
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
    const isProfile = await CoachProfile.findOne({
      where: { userId: req.user.id },
    });
    if (isProfile) {
      throw new NotFoundException('This User already has a profile');
    }
    // create a new profiles and return the newly created profiles
    return await this.coachProfileService.create(profile, req.user.id);
  }

  @ApiTags('Coach Profile')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() profile: CoachProfileUpdateDto,
    @Request() req,
  ): Promise<CoachProfile> {
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedprofile,
    } = await this.coachProfileService.update(id, profile, req.user);
    console.log('nope');
    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedprofile;
  }

  @ApiTags('Coach Profile')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    // delete the profile with this id
    const deleted = await this.coachProfileService.delete(id, req.user);

    // if the number of row affected is zero,
    // then the profile doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
