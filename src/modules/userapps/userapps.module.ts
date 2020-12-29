import { Module } from '@nestjs/common';
import { UserappsService } from './userapps.service';
import { UserappsController } from './userapps.controller';
import { userappsProviders } from './userapp.providers';

@Module({
  providers: [UserappsService, ...userappsProviders],
  controllers: [UserappsController]
})
export class UserappsModule {}
