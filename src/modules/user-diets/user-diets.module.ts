import { Module } from '@nestjs/common';
import { UserDietsService } from './user-diets.service';
import { UserDietsController } from './user-diets.controller';

@Module({
  providers: [UserDietsService],
  controllers: [UserDietsController]
})
export class UserDietsModule {}
