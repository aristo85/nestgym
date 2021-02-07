import { Inject, Injectable } from '@nestjs/common';
import { AIM_REPOSITORY } from 'src/core/constants';
import { Aim } from './aim.entity';
import { AimDto } from './dto/aim.dto';

@Injectable()
export class AimsService {
  constructor(
    @Inject(AIM_REPOSITORY)
    private readonly aimRepository: typeof Aim,
  ) {}

  async create(aim: AimDto, adminId): Promise<Aim> {
    return await this.aimRepository.create<Aim>({
      ...aim,
      adminId,
    });
  }

  async findAll(): Promise<Aim[]> {
    return await this.aimRepository.findAll<Aim>({});
  }

  async findOne(id): Promise<Aim> {
    return await this.aimRepository.findOne({
      where: { id },
    });
  }

  async update(id, data) {
    const [
      numberOfAffectedRows,
      [updatedAim],
    ] = await this.aimRepository.update(
      { ...data },
      { where: { id }, returning: true },
    );

    return { numberOfAffectedRows, updatedAim };
  }

  async delete(id) {
    return await this.aimRepository.destroy({ where: { id } });
  }
}
