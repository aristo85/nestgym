import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DIET_PROGRAM_REPOSITORY } from 'src/core/constants';
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

  ///////////////////////////////////////

  async create(data: DietProgramDto, coachId, myRequests): Promise<any> {
    // creating the diet program
    const { days, userappIds, ...other } = data;

    // change dayly programs to json
    const jsonDays = JSON.stringify(days);

    // check json correct
    if (!isJson(jsonDays)) {
      throw new NotFoundException('not correct data "days"');
    }

    // create program for each requests
    for (const appRequest of myRequests) {
      await this.dietProgramRepository.create<DietProgram>({
        ...other,
        coachId,
        userappId: appRequest.userappId,
        userId: appRequest.userId,
        days: jsonDays,
      });
    }

    return await this.dietProgramRepository
      .findAll({
        raw: true,
        nest: true,
        where: {
          userappId: [...userappIds],
          coachId,
        },
      })
      .map((el) => {
        let dataJson = isJson(el.days);
        while (isJson(dataJson)) {
          dataJson = isJson(dataJson);
        }
        return { ...el, days: dataJson };
      });
  }
  ///////////////////////////////////////

  async findAll(user): Promise<any[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    return await this.dietProgramRepository
      .findAll<DietProgram>({
        raw: true,
        nest: true,
        where: updateOPtion,
      })
      .map((el) => {
        let dataJson = isJson(el.days);
        while (isJson(dataJson)) {
          dataJson = isJson(dataJson);
        }
        return { ...el, days: dataJson };
      });
  }
  ///////////////////////////////////////

  async findOne(id, user): Promise<any> {
    // check the role
    let updateOPtion =
      user.role === 'trainer' ? { id, coachId: user.id } : { id };
    const diet: any = await this.dietProgramRepository.findOne({
      raw: true,
      nest: true,
      where: updateOPtion,
    });
    // check the json
    let dataJson = isJson(diet.days);
    while (isJson(dataJson)) {
      dataJson = isJson(dataJson);
    }

    return { ...diet, days: dataJson };
  }
  ///////////////////////////////////////

  async delete(id, coachId) {
    return await this.dietProgramRepository.destroy({ where: { id, coachId } });
  }
  ///////////////////////////////////////

  async update(id, data, userId) {
    const { days, ...other } = data;

    // change dayly programs to json
    const jsonDays = JSON.stringify(days);

    // check json correct
    if (!isJson(jsonDays)) {
      throw new NotFoundException('not correct data "days"');
    }

    // update the program
    await this.dietProgramRepository.update(
      { ...other, days: jsonDays },
      { where: { id }, returning: true },
    );

    // return the updated program with dietProducts
    const diet = await this.dietProgramRepository.findOne({
      raw: true,
      nest: true,
      where: { id },
    });
    // check the json
    let dataJson = isJson(diet.days);
    while (isJson(dataJson)) {
      dataJson = isJson(dataJson);
    }

    return { ...diet, days: dataJson };
  }
  ///////////////////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////
}
// json checker
export const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return JSON.parse(str);
};
