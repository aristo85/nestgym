import { Module } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { sportsProviders } from './sports.providers';

@Module({
  providers: [SportsService, ...sportsProviders],
  controllers: [SportsController]
})
export class SportsModule {}
