import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { photosProviders } from './photos.providers';

@Module({
  providers: [PhotosService, ...photosProviders],
  controllers: [PhotosController]
})
export class PhotosModule {}
