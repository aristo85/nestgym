import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { placesProviders } from './places.providers';

@Module({
  providers: [PlacesService, ...placesProviders],
  controllers: [PlacesController],
})
export class PlacesModule {}
