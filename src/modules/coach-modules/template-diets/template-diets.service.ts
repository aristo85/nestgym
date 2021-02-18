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

  async create(data: TemplateDietDto, userId): Promise<any> {
    // creating the template program
    const { days, ...other } = data;

    // change dayly programs to json
    const jsonDays = JSON.stringify(days);
    console.log(jsonDays);

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

  async findAll(user): Promise<RetTemplate[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

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

  async findOne(id, user): Promise<RetTemplate> {
    // check the role
    let updateOPtion =
      user.role === 'admin' ? { id } : { id, coachId: user.id };
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

  async delete(id, coachId) {
    return await this.templateDietRepository.destroy({
      where: { id, coachId },
    });
  }
  ///////////////////////////////////////

  async update(id, data, user) {
    const { days, ...other } = data;

    // check role
    let updateOPtion =
      user.role === 'admin' ? { id } : { id, coachId: user.id };

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
      where: { id },
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
