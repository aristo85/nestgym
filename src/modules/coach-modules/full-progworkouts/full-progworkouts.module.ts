import { Module } from '@nestjs/common';
import { FullProgworkoutsService } from './full-progworkouts.service';
import { FullProgworkoutsController } from './full-progworkouts.controller';
import { fullProgworkoutsProviders } from './full-progworkouts.providers';

@Module({
  providers: [FullProgworkoutsService, ...fullProgworkoutsProviders],
  controllers: [FullProgworkoutsController],
})
export class FullProgworkoutsModule {}
