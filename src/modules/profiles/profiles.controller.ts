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
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { ProfileDto, ProfileUpdateDto } from './dto/profile.dto';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';

@ApiTags('Client-Profile')
@ApiBearerAuth()
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileServise: ProfilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() profile: ProfileDto,
    @AuthUser() user: User,
    @UserRole() role: Roles,
  ): Promise<Profile> {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check if user already has a profile
    const isProfile = await Profile.findOne({
      where: {
        userId: user.id,
      },
    });
    if (isProfile) {
      throw new NotFoundException('This User already has a profile');
    }

    // create a new profile and return the newly created profile
    return await this.profileServise.createClientProfile(profile, user.id);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@UserRole() role: Roles): Promise<Profile[]> {
    // check the role
    if (role !== 'admin') {
      throw new ForbiddenException('Your role is not an admin');
    }
    // find the profile with this id
    const profile = await this.profileServise.findAllClientProfiles();

    // if the profile doesn't exit in the db, throw a 404 error
    if (!profile) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profile exist, return the profile
    return profile;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Profile> {
    // find the profiles with this id
    const profiles = await this.profileServise.findOneClientProfile(id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profiles) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profiles;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Get('client/myprofile')
  async findMyProfile(@AuthUser() user: User): Promise<Profile> {
    // find the profiles with this id
    const profiles = await this.profileServise.findMyClientProfile(user.id);

    // if the profiles doesn't exit in the db, throw a 404 error
    if (!profiles) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profiles exist, return profiles
    return profiles;
  }

  @ApiResponse({ status: 200 })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() profile: ProfileUpdateDto,
    @AuthUser() user: User,
  ): Promise<Profile> {
    // get the number of row affected and the updated profile
    const {
      numberOfAffectedRows,
      updatedProfile,
    } = await this.profileServise.updateClientProfile(id, profile, user.id);

    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedProfile;
  }

  // ////////////
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteProfile(@Param('id') id: number, @AuthUser() user: User) {
    const deleted = await this.profileServise.deleteClientProfile(id, user);
    // if the number of row affected is zero,
    // then the profile doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return success message
    return 'Successfully deleted';
  }
}
