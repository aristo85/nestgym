import { Module } from '@nestjs/common';
import { CoachappsService } from './coachapps.service';
import { CoachappsController } from './coachapps.controller';
import { coachappsProviders } from './coachapps.providers';
import { UserappsModule } from 'src/modules/userapps/userapps.module';

@Module({
  providers: [CoachappsService, ...coachappsProviders],
  controllers: [CoachappsController],
  imports: [UserappsModule],
  exports: [CoachappsService],
})
export class CoachappsModule {}
