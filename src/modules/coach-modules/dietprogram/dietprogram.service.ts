import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DIET_PROGRAM_REPOSITORY } from 'src/core/constants';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { DietProgram } from './dietprogram.entity';
import { DietProgramDto, DietProgramUpdateDto } from './dto/dietprogram.dto';

@Injectable()
export class DietprogramService {
  constructor(
    @Inject(DIET_PROGRAM_REPOSITORY)
    private readonly dietProgramRepository: typeof DietProgram,
  ) {}

  ///////////////////////////////////////

  async createDietProgram(
    data: DietProgramDto,
    coachId: number,
    userapps: Userapp[],
  ) {
    // creating the diet program
    const { days, userappIds, ...other } = data;
    // create program for each application
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

    return await this.dietProgramRepository.findAll<DietProgram>({
      raw: true,
      nest: true,
      where: { coachId: coachUserId },
    });
  }
  ///////////////////////////////////////

  async findOneDietProgram(dietProgramId: number, coachUserId?: number) {
    let dataOPtions = coachUserId
      ? { id: dietProgramId, coachId: coachUserId }
      : { id: dietProgramId };
    return await this.dietProgramRepository.findOne({
      raw: true,
      nest: true,
      where: dataOPtions,
    });
  }
  ///////////////////////////////////////

  async deleteDietProgram(dietProgramId: number, coachUserId?: number) {
    let dataOPtions = coachUserId
      ? { id: dietProgramId, coachId: coachUserId }
      : { id: dietProgramId };
    return await this.dietProgramRepository.destroy({
      where: dataOPtions,
    });
  }
  ///////////////////////////////////////

  async updateDietProgram(
    dietProgramId: number,
    data: DietProgramUpdateDto,
    coachUserId?: number,
  ) {
    // update the program
    let dataOPtions = coachUserId
      ? { id: dietProgramId, coachId: coachUserId }
      : { id: dietProgramId };
    const [affectedRows, diets] = await this.dietProgramRepository.update(
      { ...data },
      { where: dataOPtions, returning: true },
    );
    return diets;
  }
  ///////////////////////////////////////
}
