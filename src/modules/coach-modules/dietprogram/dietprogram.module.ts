import { Module } from '@nestjs/common';
import { DietprogramService } from './dietprogram.service';
import { DietprogramController } from './dietprogram.controller';
import { dietProgramProviders } from './dietprogram.providers';
import { DietproductsModule } from '../dietproducts/dietproducts.module';

@Module({
  providers: [DietprogramService, ...dietProgramProviders],
  imports: [DietproductsModule],
  controllers: [DietprogramController]
})
export class DietprogramModule {}
