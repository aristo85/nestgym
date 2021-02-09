import { Module } from '@nestjs/common';
import { UserappsService } from './userapps.service';
import { UserappsController } from './userapps.controller';
import { userappsProviders } from './userapp.providers';
import { PhotosModule } from '../photos/photos.module';

@Module({
  providers: [UserappsService, ...userappsProviders],
  controllers: [UserappsController],
  imports: [PhotosModule]
})
export class UserappsModule {}
