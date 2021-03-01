import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TEMPLATE_DIET_REPOSITORY } from 'src/core/constants';
import { RetTemplate, TemplateDietDto } from './dto/template-diet.dto';
import { TemplateDiet } from './template-diet.entity';

@Injectable()
export class TemplateDietsService {
  constructor(
    @Inject(TEMPLATE_DIET_REPOSITORY)
    private readonly templateDietRepository: typeof TemplateDiet,
  ) {}
  ///////////////////////////////////////

  async createDietTemplate(
    data: TemplateDietDto,
    coachUserId: number,
  ): Promise<TemplateDiet> {
    // creating the template program
    return await this.templateDietRepository.create<TemplateDiet>({
      ...data,
      coachId: coachUserId,
    });
  }
  ///////////////////////////////////////

  async findAllDietTemplates(coachUserId?: number): Promise<RetTemplate[]> {
    let dataOPtions = coachUserId ? { coachId: coachUserId } : {};
    return await this.templateDietRepository.findAll<TemplateDiet>({
      where: dataOPtions,
      raw: true,
      nest: true,
    });
  }
  ///////////////////////////////////////

  async findOneDietTemplate(
    templateDietId: number,
    coachUserId?: number,
  ): Promise<RetTemplate> {
    let dataOPtions = coachUserId
      ? { id: templateDietId, coachId: coachUserId }
      : { id: templateDietId };
    return await this.templateDietRepository.findOne({
      raw: true,
      nest: true,
      where: dataOPtions,
    });
  }
  ///////////////////////////////////////

  async deleteDietTemplate(templateDietId: number, coachUserId?: number) {
    let dataOPtions = coachUserId
      ? { id: templateDietId, coachId: coachUserId }
      : { id: templateDietId };
    return await this.templateDietRepository.destroy({
      where: dataOPtions,
    });
  }
  ///////////////////////////////////////

  async updateDietTemplate(
    templateDietId: number,
    data: TemplateDietDto,
    coachUserId?: number,
  ) {
    // update the program
    let updateOPtion = coachUserId
      ? { id: templateDietId, coachId: coachUserId }
      : { id: templateDietId };
    const [
      affectedRows,
      dietTemplate,
    ] = await this.templateDietRepository.update(
      { ...data },
      { where: updateOPtion, returning: true },
    );
    return dietTemplate;
  }
  ///////////////////////////////////////
}
