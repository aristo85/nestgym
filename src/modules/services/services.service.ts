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
    
      async create(data: ServicioDto, adminId): Promise<Servicio> {
        return await this.serviceRepository.create<Servicio>({
          ...data,
          adminId,
        });
      }
    
      async findAll(): Promise<Servicio[]> {
        return await this.serviceRepository.findAll<Servicio>({});
      }
    
      async findOne(id): Promise<Servicio> {
        return await this.serviceRepository.findOne({
          where: { id },
        });
      }
    
      async delete(id) {
        return await this.serviceRepository.destroy({ where: { id } });
      }
    
      async update(id, data) {
        const [
          numberOfAffectedRows,
          [updatedServicio],
        ] = await this.serviceRepository.update(
          { ...data },
          { where: { id }, returning: true },
        );
    
        return { numberOfAffectedRows, updatedServicio };
      }
}
