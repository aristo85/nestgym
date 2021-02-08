import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { profilesProviders } from './profiles.providers';
import { PhotosModule } from '../photos/photos.module';

@Module({
  providers: [ProfilesService, ...profilesProviders],
  controllers: [ProfilesController],
  imports: [PhotosModule]
})
export class ProfilesModule {}
