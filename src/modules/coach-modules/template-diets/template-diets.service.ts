import { Inject, Injectable } from '@nestjs/common';
import { TEMPLATE_DIET_REPOSITORY } from 'src/core/constants';
import { DietProduct } from '../dietproducts/dietproduct.entity';
import { DietproductsService } from '../dietproducts/dietproducts.service';
import { TemplateDietDto } from './dto/template-diet.dto';
import { TemplateDiet } from './template-diet.entity';

@Injectable()
export class TemplateDietsService {
  constructor(
    @Inject(TEMPLATE_DIET_REPOSITORY)
    private readonly templateDietRepository: typeof TemplateDiet,
    private readonly dietProductService: DietproductsService,
  ) {}

  async create(data: TemplateDietDto, userId): Promise<any> {
    // creating the template program
    const { programs, ...other } = data;
    const template = await this.templateDietRepository.create<TemplateDiet>({
      ...other,
      coachId: userId,
    });
    // creating product in dietproduct table
    let listProgs = [];
    for (const product of data.programs) {
      const newProg = await this.dietProductService.create(
        product,
        template.id,
        'template',
      );
      listProgs.push(newProg);
    }

    return await this.templateDietRepository.findOne({
      where: {
        id: template.id,
      },
      include: [DietProduct],
    });
    // return { fullProg, programs: listProgs };
  }

  async findAll(user): Promise<TemplateDiet[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list = await this.templateDietRepository.findAll<TemplateDiet>({
      where: updateOPtion,
      include: [DietProduct],
    });
    return list;
  }

  async findOne(id, user): Promise<TemplateDiet> {
    // check the role
    let updateOPtion =
      user.role === 'admin' ? { id } : { id, coachId: user.id };
    return await this.templateDietRepository.findOne({
      where: updateOPtion,
      include: [DietProduct],
    });
  }

  async delete(id, coachId) {
    return await this.templateDietRepository.destroy({
      where: { id, coachId },
    });
  }

  async update(id, data, user) {
    let updateOPtion = user.role === 'admin' ? { id } : { id, coachId: user.id };
    // delete the products for this program
    await DietProduct.destroy({ where: { templateDietId: id } });
    // recreate products for this program
    const { programs, ...other } = data;
    for (const product of programs) {
      await this.dietProductService.create(product, id, 'template');
    }
    // update the program
    await this.templateDietRepository.update(
      { ...other },
      { where: updateOPtion, returning: true },
    );
    // return the updated program with dietProducts
    return await this.templateDietRepository.findOne({
      where: {
        id,
      },
      include: [DietProduct],
    });
  }
}
