import { Module } from '@nestjs/common';
import { DietprogramService } from './dietprogram.service';
import { DietprogramController } from './dietprogram.controller';
import { dietProgramProviders } from './dietprogram.providers';

@Module({
  providers: [DietprogramService, ...dietProgramProviders],
  controllers: [DietprogramController],
})
export class DietprogramModule {}
