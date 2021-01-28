import { Inject, Injectable } from '@nestjs/common';
import { DIET_PROGRAM_REPOSITORY } from 'src/core/constants';
import { DietProduct } from '../dietproducts/dietproduct.entity';
import { DietproductsService } from '../dietproducts/dietproducts.service';
import { DietProgram } from './dietprogram.entity';
import { DietProgramDto } from './dto/dietprogram.dto';

@Injectable()
export class DietprogramService {
  constructor(
    @Inject(DIET_PROGRAM_REPOSITORY)
    private readonly dietProgramRepository: typeof DietProgram,
    private readonly dietProductService: DietproductsService,
  ) {}

  async create(data: DietProgramDto, coachId): Promise<any> {
    // creating the diet program
    const { programs, clientIds, ...other } = data;
    for (const client of clientIds) {
      const fullProg = await this.dietProgramRepository.create<DietProgram>({
        ...other,
        coachId,
        userId: client,
      });
      // creating product in dietProduct table
      let listProgs = [];
      for (const product of programs) {
        const newProg = await this.dietProductService.create(
          product,
          fullProg.id,
        );
        listProgs.push(newProg);
      }
    }

    return await this.dietProgramRepository.findAll({
      where: {
        userId: [...clientIds],
        coachId,
      },
      include: [DietProduct],
    });
    // return { fullProg, programs: listProgs };
  }

  async findAll(user): Promise<DietProgram[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list = await this.dietProgramRepository.findAll<DietProgram>({
      where: updateOPtion,
      include: [DietProduct],
    });
    return list;
  }

  async findOne(id, user): Promise<DietProgram> {
    // check the role
    let updateOPtion =
      user.role === 'trainer' ? { id, coachId: user.id } : { id };
    return await this.dietProgramRepository.findOne({
      where: updateOPtion,
      include: [DietProduct],
    });
  }

  async delete(id, coachId) {
    return await this.dietProgramRepository.destroy({ where: { id, coachId } });
  }

  async update(id, data, userId) {
    // delete the products for this program
    await DietProduct.destroy({ where: { dietProgramId: id } });
    // recreate products for this program
    const { programs, ...other } = data;
    for (const product of programs) {
      await this.dietProductService.create(product, id);
    }
    // update the program
    await this.dietProgramRepository.update(
      { ...other },
      { where: { id }, returning: true },
    );
    // return the updated program with dietProducts
    return await this.dietProgramRepository.findOne({
      where: {
        id,
      },
      include: [DietProduct],
    });
  }
}
