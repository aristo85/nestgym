import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';

@ApiTags('Profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileServise: ProfilesService) {}

  @ApiResponse({ status: 200 })
  @Get(':userId')
  async findOne(@Param('userId') userId: number): Promise<Profile> {
    // find the profile with this id
    const profile = await this.profileServise.findOne(userId);

    // if the profile doesn't exit in the db, throw a 404 error
    if (!profile) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profile exist, return the profile
    return profile;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() profile: ProfileDto, @Request() req): Promise<Profile> {
    // check if user already has a profile
    const isProfile = await this.profileServise.findOne(req.user.id);
    if (isProfile) {
      throw new NotFoundException('This User already has a profile');
    }

    // create a new profile and return the newly created profile
    return await this.profileServise.create(profile, req.user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() profile: ProfileDto,
    @Request() req,
  ): Promise<Profile> {
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedProfile,
    } = await this.profileServise.update(id, profile, req.user.id);

    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedProfile;
  }
}
