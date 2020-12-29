import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './profile.entity';
import { ProfilesService } from './profiles.service';

@ApiTags("Profile")
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileServise: ProfilesService) {}

  @ApiResponse({status: 200})
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Profile> {
    // find the profile with this id
    const profile = await this.profileServise.findOne(id);

    // if the profile doesn't exit in the db, throw a 404 error
    if (!profile) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // if profile exist, return the profile
    return profile;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post()
  // async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
  //     // create a new post and return the newly created post
  //     return await this.profileServise.create(post, req.user.id);
  // }

  @ApiResponse({status: 200})
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
    } = await this.profileServise.update(id, profile);

    // if the number of row affected is zero,
    // it means the profile doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This profile doesn't exist");
    }

    // return the updated profile
    return updatedProfile;
  }
}
