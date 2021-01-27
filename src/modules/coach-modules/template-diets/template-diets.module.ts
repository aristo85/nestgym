import { Module } from '@nestjs/common';
import { TemplateDietsService } from './template-diets.service';
import { TemplateDietsController } from './template-diets.controller';
import { templateDietsProviders } from './template-diets.providers';
import { DietproductsModule } from '../dietproducts/dietproducts.module';

@Module({
  providers: [TemplateDietsService, ...templateDietsProviders],
  imports: [DietproductsModule],
  controllers: [TemplateDietsController]
})
export class TemplateDietsModule {}
