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

  async create(data: DietProgramDto, coachId, myRequests): Promise<any> {
    // creating the diet program
    const { days, userappIds, ...other } = data;
    // change dayly programs to json
    const jsonDays = JSON.stringify(days);
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
        where: {
          userappId: [...userappIds],
          coachId,
        },
      })
      .map(async (diet: any) => {
        // check the json
        const checkJson = this.isJson(diet.days);
        return checkJson
          ? { ...diet.toJSON(), days: JSON.parse(diet.days) }
          : diet;
      });
  }

  async findAll(user): Promise<DietProgram[]> {
    // check if from admin
    let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const list = await this.dietProgramRepository
      .findAll<DietProgram>({
        where: updateOPtion,
      })
      .map(async (diet: any) => {
        // check the json
        const checkJson = this.isJson(diet.days);
        return checkJson
          ? { ...diet.toJSON(), days: JSON.parse(diet.days) }
          : diet;
      });
    return list;
  }

  async findOne(id, user): Promise<DietProgram> {
    // check the role
    let updateOPtion =
      user.role === 'trainer' ? { id, coachId: user.id } : { id };
    const diet: any = await this.dietProgramRepository.findOne({
      where: updateOPtion,
    }); 
    // check the json
    const checkJson = this.isJson(diet.days);
    return checkJson ? { ...diet.toJSON(), days: JSON.parse(diet.days) } : diet;
  }

  async delete(id, coachId) {
    return await this.dietProgramRepository.destroy({ where: { id, coachId } });
  }

  async update(id, data, userId) {
    // // delete the products for this program
    // await DietProduct.destroy({ where: { dietProgramId: id } });
    // // recreate products for this program
    // const { programs, ...other } = data;
    // for (const product of programs) {
    //   await this.dietProductService.create(product, id);
    // }

    // creating the diet program
    const { days, ...other } = data;
    // change dayly programs to json
    const jsonDays = JSON.stringify(days);
    // update the program
    await this.dietProgramRepository.update(
      { ...data, days: jsonDays },
      { where: { id }, returning: true },
    );
    // return the updated program with dietProducts
    const diet: any = (
      await this.dietProgramRepository.findOne({
        where: {
          id,
        },
      })
    )// check the json
    const checkJson = this.isJson(diet.days);
    return checkJson ? { ...diet.toJSON(), days: JSON.parse(diet.days) } : diet;
  }


  // json checker
  private isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
