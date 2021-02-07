import { Inject, Injectable } from '@nestjs/common';
import {
  DIET_PRODUCT_REPOSITORY,
  WORKOUT_PROGRAM_REPOSITORY,
} from 'src/core/constants';
import { DietProduct } from './dietproduct.entity';
import { DietProductDto } from './dto/dietproduct.dto';

@Injectable()
export class DietproductsService {
  constructor(
    @Inject(DIET_PRODUCT_REPOSITORY)
    private readonly dietProductRepository: typeof DietProduct,
  ) {}

  async create(
    prog: DietProductDto,
    templateOrDietprog,
    template = '',
  ): Promise<DietProduct> {
    // if from template or diet program
    let options =
      template === 'template'
        ? { ...prog, templateDietId: templateOrDietprog }
        : { ...prog, dietProgramId: templateOrDietprog };
    return await this.dietProductRepository.create<DietProduct>({
      ...options,
    });
  }
}
