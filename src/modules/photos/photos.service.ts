import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PHOTO_REPOSITORY } from '../../core/constants';
import { Photo } from './photo.entity';
import { PhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_REPOSITORY)
    private readonly photoRepository: typeof Photo,
  ) {}

  async create(photo: PhotoDto, userId): Promise<Photo> {
    return await this.photoRepository.create<Photo>({ ...photo, userId });
  }

  async findOne(id): Promise<Photo> {
    return await this.photoRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Photo[]> {
    return await this.photoRepository.findAll<Photo>({});
  }

  async delete(id) {
    return await this.photoRepository.destroy({ where: { id } });
  }

}
