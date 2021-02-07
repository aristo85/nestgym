import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { servicesProviders } from './services.providers';

@Module({
  providers: [ServicesService, ...servicesProviders],
  controllers: [ServicesController],
})
export class ServicesModule {}
