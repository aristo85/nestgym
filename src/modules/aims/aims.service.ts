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

  async create(aim: AimDto, adminId: number): Promise<Aim> {
    return await this.aimRepository.create<Aim>({
      ...aim,
      adminId,
    });
  }

  async findAll(): Promise<Aim[]> {
    return await this.aimRepository.findAll<Aim>({});
  }

  async findOne(aimId: number): Promise<Aim> {
    return await this.aimRepository.findOne({
      where: { id: aimId },
    });
  }

  async update(aimId: number, data: AimDto) {
    const [
      numberOfAffectedRows,
      [updatedAim],
    ] = await this.aimRepository.update(
      { ...data },
      { where: { id: aimId }, returning: true },
    );

    return { numberOfAffectedRows, updatedAim };
  }

  async delete(aimId: number) {
    return await this.aimRepository.destroy({ where: { id: aimId } });
  }
}
