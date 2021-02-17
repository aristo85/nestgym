import { Module } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { UserProgressController } from './user-progress.controller';
import { userProgressProviders } from './user-progress.providers';
import { PhotosModule } from '../photos/photos.module';

@Module({
  providers: [UserProgressService, ...userProgressProviders],
  controllers: [UserProgressController],
  imports: [PhotosModule],
})
export class UserProgressModule {}
