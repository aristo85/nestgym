import { Module } from '@nestjs/common';
import { TemplateDietsService } from './template-diets.service';
import { TemplateDietsController } from './template-diets.controller';
import { templateDietsProviders } from './template-diets.providers';

@Module({
  providers: [TemplateDietsService, ...templateDietsProviders],
  controllers: [TemplateDietsController],
})
export class TemplateDietsModule {}
