import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { profilesProviders } from './profiles.providers';

@Module({
  providers: [ProfilesService, ...profilesProviders],
  exports: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
