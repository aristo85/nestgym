import { Module } from '@nestjs/common';
import { DietsService } from './diets.service';
import { DietsController } from './diets.controller';
import { dietsProviders } from './diets.providers';

@Module({
  providers: [DietsService, ...dietsProviders],
  controllers: [DietsController],
})
export class DietsModule {}
