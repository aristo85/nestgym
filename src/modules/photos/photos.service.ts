import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PHOTO_REPOSITORY } from '../../core/constants';
import { Photo } from './photo.entity';
import { PhotoDto } from './dto/photo.dto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_REPOSITORY)
    private readonly photoRepository: typeof Photo,
  ) {}

  async create(data: PhotoDto, userId): Promise<string[]> {
    if (!existsSync('images')) {
      mkdirSync('images');
    }
    //
    const pathes = [];
    for await (const pict of data.photoPathes) {
      const basePict = pict.split(';base64,').pop();
      const hashSum = crypto.createHash('sha256');
      const hashPicture = hashSum.update(basePict).digest('hex');
      const imageName = `${hashPicture}.jpg`;
      // const imagePath = join(
      //   __dirname,
      //   '..',
      //   '..',
      //   'images',
      //   `${hashPicture}.jpg`,
      // );
      const localPath = join('images', `${hashPicture}.jpg`);
      writeFileSync(localPath, basePict, { encoding: 'base64' });
      //
      // // const found =
      await this.photoRepository.findOrCreate<Photo>({
        where: { photoPath: imageName, userId },
      });

      pathes.push(imageName);
    }

    return pathes.map((path) => `https://${process.env.DOMAIN_NAME}/${path}`);
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
  /////////////////////////////////////

  private async uploadPictures(pictures: string[]) {
    // статику храним в корень сервера/images
    if (!existsSync('images')) {
      mkdirSync('images');
    }
    //

    const pathes = [];
    for await (const pict of pictures) {
      const basePict = pict.split(';base64,').pop();
      const hashSum = crypto.createHash('sha256');
      const hashPicture = hashSum.update(basePict).digest('hex');
      const imagePath = join(
        __dirname,
        '..',
        '..',
        'images',
        `${hashPicture}.jpg`,
      );
      join('images', `${hashPicture}.jpg`);
      writeFileSync(imagePath, basePict, { encoding: 'base64' });
      //
      // const found =
      await this.photoRepository.findOrCreate({
        where: { hash: hashPicture },
      });
      // if (found[0]) {
      //   const pictureModel = found[0];
      //   await pictureModel.update({
      //     hash: hashPicture,
      //     path: `${hashPicture}.jpg`,
      //   });
      pathes.push(`${hashPicture}.jpg`);
      // }
    }
    return pathes.map((path) => `https://${process.env.DOMAIN_NAME}/${path}`);
  }
}
