import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { publicationsProviders } from './publications.providers';

@Module({
  providers: [PublicationsService, ...publicationsProviders],
  controllers: [PublicationsController]
})
export class PublicationsModule {}
