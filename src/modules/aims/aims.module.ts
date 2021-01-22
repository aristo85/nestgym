import { Module } from '@nestjs/common';
import { AimsService } from './aims.service';
import { AimsController } from './aims.controller';
import { aimsProviders } from './aims.providers';

@Module({
  providers: [AimsService, ...aimsProviders],
  controllers: [AimsController]
})
export class AimsModule {}
