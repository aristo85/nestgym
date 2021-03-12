import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { faqsProviders } from './faq.providers';

@Module({
  providers: [FaqService, ...faqsProviders],
  controllers: [FaqController],
})
export class FaqModule {}
