import { Inject, Injectable } from '@nestjs/common';
import { SPORT_REPOSITORY } from 'src/core/constants';
import { SportDto } from './dto/sport.dto';
import { Sport } from './sport.entity';

@Injectable()
export class SportsService {
  constructor(
    @Inject(SPORT_REPOSITORY)
    private readonly sportRepository: typeof Sport,
  ) {}

  async createSport(sport: SportDto, adminId: number): Promise<Sport> {
    return await this.sportRepository.create<Sport>({
      ...sport,
      adminId,
    });
  }

  async findAllSports(): Promise<Sport[]> {
    return await this.sportRepository.findAll<Sport>({});
  }

  async findOneSport(sportId: number): Promise<Sport> {
    return await this.sportRepository.findOne({
      where: { id: sportId },
    });
  }

  async deleteSport(sportId: number) {
    return await this.sportRepository.destroy({ where: { id: sportId } });
  }

  async updateSport(sportId: number, data: SportDto) {
    const [
      numberOfAffectedRows,
      [updatedSport],
    ] = await this.sportRepository.update(
      { ...data },
      { where: { id: sportId }, returning: true },
    );

    return { numberOfAffectedRows, updatedSport };
  }
}
