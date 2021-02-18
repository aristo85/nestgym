import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DIET_PROGRAM_REPOSITORY } from 'src/core/constants';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { DietproductsService } from '../dietproducts/dietproducts.service';
import { DietProgram } from './dietprogram.entity';
import { DietProgramDto, DietProgramUpdateDto } from './dto/dietprogram.dto';

@Injectable()
export class DietprogramService {
  constructor(
    @Inject(DIET_PROGRAM_REPOSITORY)
    private readonly dietProgramRepository: typeof DietProgram,
    private readonly dietProductService: DietproductsService,
  ) {}

  ///////////////////////////////////////

  async createDietProgram(
    data: DietProgramDto,
    coachId: number,
    userapps: Userapp[],
  ) {
    // creating the diet program
    const { days, userappIds, ...other } = data;

    // change dayly programs to json
    // const jsonDays = JSON.stringify(days);

    // check json correct
    // if (!isJson(jsonDays)) {
    //   throw new NotFoundException('not correct data "days"');
    // }

    // create program for each requests
    return await this.dietProgramRepository.bulkCreate<DietProgram>(
      userapps.map(
        (userapp) => ({
          ...other,
          coachId,
          userappId: userapp.id,
          userId: userapp.userId,
          days: days,
        }),
        { returning: true },
      ),
    );
  }
  ///////////////////////////////////////

  async findAllDietProgramms(coachUserId: number) {
    // check if from admin
    // let updateOPtion = user.role === 'admin' ? {} : { coachId: user.id };

    const diets = await this.dietProgramRepository.findAll<DietProgram>({
      raw: true,
      nest: true,
      where: { coachId: coachUserId },
    });

    return diets;
    // .map((el) => {
    //   let dataJson = isJson(el.days);
    //   while (isJson(dataJson)) {
    //     dataJson = isJson(dataJson);
    //   }
    //   return { ...el, days: dataJson };
    // });
  }
  ///////////////////////////////////////

  async findOneDietProgram(dietProgramId: number, coachUserId?: number) {
    // check the role
    // let updateOPtion =
    //   user.role === 'trainer' ? { id, coachId: user.id } : { id };
    const diets = await this.dietProgramRepository.findOne({
      raw: true,
      nest: true,
      where: { id: dietProgramId, coachId: coachUserId },
    });

    return diets;
    // check the json
    // let dataJson = isJson(diet.days);
    // while (isJson(dataJson)) {
    //   dataJson = isJson(dataJson);
    // }

    // return { ...diet, days: dataJson };
  }
  ///////////////////////////////////////

  async deleteDietProgram(dietProgramId: number, coachUserId?: number) {
    return await this.dietProgramRepository.destroy({
      where: { id: dietProgramId, coachId: coachUserId },
    });
  }
  ///////////////////////////////////////

  async updateDietProgram(
    dietProgramId: number,
    data: DietProgramUpdateDto,
    coachUserId: number,
  ) {
    // const { days, ...other } = data;

    // // change dayly programs to json
    // const jsonDays = JSON.stringify(days);

    // // check json correct
    // if (!isJson(jsonDays)) {
    //   throw new NotFoundException('not correct data "days"');
    // }

    const { days, ...other } = data;

    // update the program
    const [affectedRows, diets] = await this.dietProgramRepository.update(
      { ...other, days },
      { where: { id: dietProgramId, coachId: coachUserId }, returning: true },
    );

    return diets;

    // return the updated program with dietProducts
    // const diet = await this.dietProgramRepository.findOne({
    //   raw: true,
    //   nest: true,
    //   where: { id },
    // });
    // // check the json
    // let dataJson = isJson(diet.days);
    // while (isJson(dataJson)) {
    //   dataJson = isJson(dataJson);
    // }

    // return { ...diet, days: dataJson };
  }
  ///////////////////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////
}
// json checker
// export const isJson = (str) => {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return JSON.parse(str);
// };
