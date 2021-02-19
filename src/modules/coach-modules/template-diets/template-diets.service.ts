import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TEMPLATE_DIET_REPOSITORY } from 'src/core/constants';
import { DietproductsService } from '../dietproducts/dietproducts.service';
import { RetTemplate, TemplateDietDto } from './dto/template-diet.dto';
import { TemplateDiet } from './template-diet.entity';

@Injectable()
export class TemplateDietsService {
  constructor(
    @Inject(TEMPLATE_DIET_REPOSITORY)
    private readonly templateDietRepository: typeof TemplateDiet,
    private readonly dietProductService: DietproductsService,
  ) {}
  ///////////////////////////////////////

  async createDietTemplate(
    data: TemplateDietDto,
    userId: number,
  ): Promise<any> {
    // creating the template program
    const { days, ...other } = data;

    // change dayly programs to json
    const jsonDays = JSON.stringify(days);

    // check json correct
    // if (!isJson(jsonDays)) {
    //   throw new NotFoundException('not correct data "days"');
    // }

    // create program eith json days
    const template = await this.templateDietRepository.create<TemplateDiet>({
      ...other,
      coachId: userId,
      days: jsonDays,
    });

    const diet = await this.templateDietRepository.findOne({
      raw: true,
      nest: true,
      where: {
        id: template.id,
      },
    });

    // check the json
    // let dataJson = isJson(diet.days);
    // while (isJson(dataJson)) {
    //   dataJson = isJson(dataJson);
    // }

    return { ...diet };
  }
  ///////////////////////////////////////

  async findAllDietTemplates(
    coachId: number,
    role: string,
  ): Promise<RetTemplate[]> {
    // check if from admin
    let updateOPtion = role === 'admin' ? {} : { coachId };

    const list = await this.templateDietRepository.findAll<TemplateDiet>({
      where: updateOPtion,
      raw: true,
      nest: true,
    });
    // .map((el) => {
    //   let dataJson = isJson(el.days);
    //   while (isJson(dataJson)) {
    //     dataJson = isJson(dataJson);
    //   }
    //   return { ...el, days: dataJson };
    // });
    return list;
  }
  ///////////////////////////////////////

  async findOneDietTemplate(
    templateDietId: number,
    coachId: number,
    role: string,
  ): Promise<RetTemplate> {
    // check the role
    let updateOPtion =
      role === 'admin'
        ? { id: templateDietId }
        : { id: templateDietId, coachId };
    const diet = await this.templateDietRepository.findOne({
      raw: true,
      nest: true,
      where: updateOPtion,
    });
    // check the json
    // let dataJson = isJson(diet.days);
    // while (isJson(dataJson)) {
    //   dataJson = isJson(dataJson);
    // }
    return { ...diet };
  }
  ///////////////////////////////////////

  async deleteDietTemplate(templateDietId: number, coachId: number) {
    return await this.templateDietRepository.destroy({
      where: { id: templateDietId, coachId },
    });
  }
  ///////////////////////////////////////

  async updateDietTemplate(
    templateDietId: number,
    data: TemplateDietDto,
    coachId: number,
    role: string,
  ) {
    const { days, ...other } = data;

    // check role
    let updateOPtion =
      role === 'admin'
        ? { id: templateDietId }
        : { id: templateDietId, coachId };

    // change dayly programs to json
    const jsonDays = JSON.stringify(days);

    // check json correct
    // if (!isJson(jsonDays)) {
    //   throw new NotFoundException('not correct data "days"');
    // }

    // update the program
    await this.templateDietRepository.update(
      { ...other, days },
      { where: updateOPtion, returning: true },
    );

    // return the updated program with
    const diet = await this.templateDietRepository.findOne({
      raw: true,
      nest: true,
      where: { id: templateDietId },
    });
    // check the json
    // let dataJson = isJson(diet.days);
    // while (isJson(dataJson)) {
    //   dataJson = isJson(dataJson);
    // }

    return { ...diet };
  }
  ///////////////////////////////////////
}
