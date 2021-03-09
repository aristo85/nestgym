import { Inject, Injectable } from '@nestjs/common';
import { DIET_REPOSITORY } from 'src/core/constants';
import { Diet } from './diet.entity';
import { DietDto } from './dto/diet.dto';

@Injectable()
export class DietsService {
  constructor(
    @Inject(DIET_REPOSITORY)
    private readonly dietRepository: typeof Diet,
  ) {}

  async createDiet(diet: DietDto, adminId: number): Promise<Diet> {
    return await this.dietRepository.create<Diet>({
      ...diet,
      adminId,
    });
  }

  async findAllDiets(): Promise<Diet[]> {
    return await this.dietRepository.findAll<Diet>({});
  }

  async findOneDiet(dietId: number): Promise<Diet> {
    return await this.dietRepository.findOne({
      where: { id: dietId },
    });
  }

  async deleteDiet(dietId: number) {
    return await this.dietRepository.destroy({ where: { id: dietId } });
  }

  async updateDiet(dietId: number, data: DietDto) {
    const [
      numberOfAffectedRows,
      [updatedDiet],
    ] = await this.dietRepository.update(
      { ...data },
      { where: { id: dietId }, returning: true },
    );

    return { numberOfAffectedRows, updatedDiet };
  }
}
