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
          ? { userId, hashPicture }
          : { ...sourceId, userId, hashPicture };
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
        const { numberOfAffectedRows, updatedPhoto } = await this.update(
          photoData.id,
          sourceId,
        );
        if (numberOfAffectedRows > 0) {
          photoNames.push({
            ...updatedPhoto.toJSON(),
            photo: `https://${process.env.DOMAIN_NAME}/${imageName}`,
          });
        } else {
          photoNames.push({
            ...photoData.toJSON(),
            photo: `https://${process.env.DOMAIN_NAME}/${imageName}`,
          });
        }
      } else {
        photoNames.push({
          ...photoData.toJSON(),
          photo: `https://${process.env.DOMAIN_NAME}/${imageName}`,
        });
      }
    }

    return photoNames;
  }

  async findOne(id, userId): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });
    if (photo) {
      const plainData: any = photo.get({ plain: true });
      const photoPath = `https://${process.env.DOMAIN_NAME}/${plainData.photo}`;
      return { ...plainData, photo: photoPath };
    } else {
      return photo;
    }
  }

  async findAll(sourceId): Promise<any[]> {
    return await this.photoRepository
      .findAll<Photo>({ where: { ...sourceId } })
      .map((photo) => {
        const plainPhoto: any = photo.get({ plain: true });
        return {
          ...plainPhoto,
          photo: `https://${process.env.DOMAIN_NAME}/${plainPhoto.photo}`,
        };
      });
  }

  async delete(id, userId, name, checkOtherIds, updateSourceId) {
    // check if all Ids (profile, userapp, progress, feedback)
    const findPhoto = await Photo.findOne({ where: { id, ...checkOtherIds } });
    console.log(findPhoto, checkOtherIds);
    // if only  belongs to source ID, then delete it from everywhere, otherwise update sourceId to null
    if (findPhoto) {
      const path = `./images/${name}`;
      try {
        unlinkSync(path);
        //file removed
      } catch (err) {
        console.error(err);
      }
      return await this.photoRepository.destroy({ where: { id } });
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

  // private async uploadPictures(pictures: string[]) {
  //   // статику храним в корень сервера/images
  //   if (!existsSync('images')) {
  //     mkdirSync('images');
  //   }
  //   //

  //   const pathes = [];
  //   for await (const pict of pictures) {
  //     const basePict = pict.split(';base64,').pop();
  //     const hashSum = crypto.createHash('sha256');
  //     const hashPicture = hashSum.update(basePict).digest('hex');
  //     const imagePath = join(
  //       __dirname,
  //       '..',
  //       '..',
  //       'images',
  //       `${hashPicture}.jpg`,
  //     );
  //     join('images', `${hashPicture}.jpg`);
  //     writeFileSync(imagePath, basePict, { encoding: 'base64' });
  //     //
  //     // const found =
  //     await this.photoRepository.findOrCreate({
  //       where: { hash: hashPicture },
  //     });
  //     // if (found[0]) {
  //     //   const pictureModel = found[0];
  //     //   await pictureModel.update({
  //     //     hash: hashPicture,
  //     //     path: `${hashPicture}.jpg`,
  //     //   });
  //     pathes.push(`${hashPicture}.jpg`);
  //     // }
  //   }
  //   return pathes.map((path) => `https://${process.env.DOMAIN_NAME}/${path}`);
  // }
}
