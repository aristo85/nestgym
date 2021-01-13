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

  async findOne(id, userId): Promise<Photo> {
    return await this.photoRepository.findOne({
      where: { id, userId },
    });
  }

  async findAll(userId): Promise<Photo[]> {
    return await this.photoRepository.findAll<Photo>({ where: { userId } });
  }

  async delete(id, userId) {
    return await this.photoRepository.destroy({ where: { id, userId } });
  }
}
