import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_REPOSITORY } from 'src/core/constants';
import { ServicioDto } from './dto/service.dto';
import { Servicio } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: typeof Servicio,
  ) {}

  async createService(data: ServicioDto, adminId: number): Promise<Servicio> {
    return await this.serviceRepository.create<Servicio>({
      ...data,
      adminId,
    });
  }

  async findAllServices(): Promise<Servicio[]> {
    return await this.serviceRepository.findAll<Servicio>({});
  }

  async findOneService(serviceId: number): Promise<Servicio> {
    return await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
  }

  async deleteService(serviceId: number) {
    return await this.serviceRepository.destroy({ where: { id: serviceId } });
  }

  async updateService(serviceId: number, data: ServicioDto) {
    const [
      numberOfAffectedRows,
      [updatedServicio],
    ] = await this.serviceRepository.update(
      { ...data },
      { where: { id: serviceId }, returning: true },
    );

    return { numberOfAffectedRows, updatedServicio };
  }
}
