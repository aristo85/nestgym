import { Inject, Injectable } from '@nestjs/common';
import { DIET_PRODUCT_REPOSITORY, WORKOUT_PROGRAM_REPOSITORY } from 'src/core/constants';
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
    dietProgramId,
  ): Promise<DietProduct> {
    return await this.dietProductRepository.create<DietProduct>({
      ...prog,
      dietProgramId,
    });
  }
}
