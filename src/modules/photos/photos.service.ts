import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PHOTO_REPOSITORY } from '../../core/constants';
import { Photo } from './photo.entity';
import { PhotoDto } from './dto/photo.dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_REPOSITORY)
    private readonly photoRepository: typeof Photo,
  ) {}

  async create(data: PhotoDto, userId, sourceId): Promise<string[]> {
    if (!existsSync('images')) {
      mkdirSync('images');
    }
    //
    const photoNames = [];
    for await (const pict of data.photo) {
      const basePict = pict.split(';base64,').pop();
      const hashSum = crypto.createHash('sha256');
      const hashPicture = hashSum.update(basePict).digest('hex');
      const imageName = `${hashPicture}.jpg`;

      const localPath = join('images', `${hashPicture}.jpg`);
      writeFileSync(localPath, basePict, { encoding: 'base64' });
      //
      const optionData =
        Object.entries(sourceId).length === 0
          ? { userId }
          : { ...sourceId, userId };
      // if new, add source ID (profileId, userappId, progressId, feedbackId)
      const [
        photoData,
        isCreated,
      ] = await this.photoRepository.findOrCreate<Photo>({
        where: { photo: imageName },
        defaults: optionData,
      });
      // if exists, update source ID (profileId, userappId, progressId, feedbackId)
      if (!isCreated && Object.entries(sourceId).length !== 0) {
        await this.update(photoData.id, sourceId);
      }

      photoNames.push(imageName);
    }

    return photoNames.map(
      (path) => `https://${process.env.DOMAIN_NAME}/${path}`,
    );
  }

  async findOne(id, userId): Promise<Photo> {
    return await this.photoRepository.findOne({
      where: { id, userId },
    });
  }

  async findAll(userId): Promise<Photo[]> {
    return await this.photoRepository.findAll<Photo>({ where: { userId } });
  }

  async delete(id, userId, name, checkOtherIds, updateSourceId) {
    // check if all Ids (profile, userapp, progress, feedback)
    const findPhoto = await Photo.findOne({ where: checkOtherIds });
    // if only  belongs to source ID, then delete it from everywhere, otherwise update sourceId to null
    if (findPhoto) {
      const path = `./images/${name}`;
      try {
        unlinkSync(path);
        //file removed
      } catch (err) {
        console.error(err);
      }
      return await this.photoRepository.destroy({ where: { id, userId } });
    } else {
      await Photo.update(updateSourceId, { where: { id } });
      return 1;
    }
  }

  async update(id, data) {
    const [
      numberOfAffectedRows,
      [updatedPhoto],
    ] = await this.photoRepository.update(
      { ...data },
      { where: { id }, returning: true },
    );

    return { numberOfAffectedRows, updatedPhoto };
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
