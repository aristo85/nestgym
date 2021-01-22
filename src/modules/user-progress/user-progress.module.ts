import { Module } from '@nestjs/common';
import { UserProgressService } from './user-progress.service';
import { UserProgressController } from './user-progress.controller';
import { userProgressProviders } from './user-progress.providers';

@Module({
  providers: [UserProgressService, ...userProgressProviders],
  controllers: [UserProgressController]
})
export class UserProgressModule {}
