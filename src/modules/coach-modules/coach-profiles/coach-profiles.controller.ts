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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileUpdateDto } from 'src/modules/profiles/dto/profile.dto';
import { User } from 'src/modules/users/user.entity';
import { AuthUser } from 'src/modules/users/users.decorator';
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
    @Body() profile: CoachProfileUpdateDto,
    @Request() req: Request,
    @AuthUser() user: User,
  ): Promise<CoachProfile> {
    // first update services
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedprofile,
    } = await this.coachProfileService.updateCoachProfileFromAdmin(
      id,
      profile,
      user,
    );
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
  async findAll(
    @Req() req: Request & { res: Response },
    @AuthUser() user: User,
  ) {
    if (user.role === 'user') {
      throw new NotFoundException('your role is "user"');
    }
    // get all profiles in the db
    const list = await this.coachProfileService.findAllCoachProfiles(user);
    const count = list.length;

    req.res.set('Access-Control-Expose-Headers', 'Content-Range');
    req.res.set('Content-Range', `0-${count}/${count}`);
    return list;
  }

  @ApiTags('Coach Profile')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CoachProfile> {
    // find the profiles with this id
    const profile = await this.coachProfileService.findOneCoachProfile(id);

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
  async findMyProfile(@AuthUser() user: User): Promise<CoachProfile> {
    // find the profiles with this id
    const profile = await this.coachProfileService.findMyCoachProfile(user.id);

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
    @Body() profileDto: CoachProfileDto,
    @AuthUser() user: User,
  ): Promise<CoachProfile> {
    // check the role
    if (user.role !== 'trainer') {
      throw new NotFoundException('Your role is not a trainer');
    }
    // check if user already has a profile
    const isProfile = await CoachProfile.findOne({
      where: { userId: user.id },
    });
    if (isProfile) {
      throw new NotFoundException('This User already has a profile');
    }
    // create a new profiles and return the newly created profiles
    const { profile } = await this.coachProfileService.createCoachProfile(
      profileDto,
      user.id,
    );

    return profile;
  }

  @ApiTags('Coach Profile')
  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() profile: CoachProfileUpdateDto,
    @AuthUser() user: User,
  ): Promise<CoachProfile> {
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedprofile,
    } = await this.coachProfileService.updateCoachProfile(id, profile, user);
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
  async remove(@Param('id') id: number, @AuthUser() user: User) {
    // delete the profile with this id
    const deleted = await this.coachProfileService.deleteCoachProfile(id, user);

    // if the number of row affected is zero,
    // then the profile doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
