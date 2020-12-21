import { Body, Controller, Get, Post } from '@nestjs/common';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  public async getProfiles(): Promise<Profile[]> {
    return this.profileService.getAllProfiles();
  }
  // @Post()
  // public async createProfile(@Body() body): Promise<Profile> {
  //   return this.profileService.createProfile(body);
  // }
}
