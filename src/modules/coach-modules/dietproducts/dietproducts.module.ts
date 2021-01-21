import { Module } from '@nestjs/common';
import { DietproductsService } from './dietproducts.service';
import { DietproductsController } from './dietproducts.controller';
import { dietProductsProviders } from './dietproducts.providers';

@Module({
  providers: [DietproductsService, ...dietProductsProviders],
  exports: [DietproductsService],
  controllers: [DietproductsController],
})
export class DietproductsModule {}
