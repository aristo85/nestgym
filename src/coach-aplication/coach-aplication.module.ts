import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CoachAplicationController } from './coach-aplication.controller';
import { CoachAplicationService } from './coach-aplication.service';
import { coachAppProviders } from './coach-aplication.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CoachAplicationController],
  providers: [CoachAplicationService, ...coachAppProviders],
})
export class CoachAplicationModule {}
