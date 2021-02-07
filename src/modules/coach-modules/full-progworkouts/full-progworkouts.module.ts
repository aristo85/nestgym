import { Module } from '@nestjs/common';
import { FullProgworkoutsService } from './full-progworkouts.service';
import { FullProgworkoutsController } from './full-progworkouts.controller';
import { fullProgworkoutsProviders } from './full-progworkouts.providers';
import { WorkoutProgramsModule } from '../workout-programs/workout-programs.module';

@Module({
  providers: [FullProgworkoutsService, ...fullProgworkoutsProviders],
  imports: [WorkoutProgramsModule],
  controllers: [FullProgworkoutsController],
})
export class FullProgworkoutsModule {}
