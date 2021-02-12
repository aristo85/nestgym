import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PHOTO_REPOSITORY } from '../../core/constants';
import { Photo } from './photo.entity';
import { PhotoData, PhotoDto } from './dto/photo.dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';
import { PhotoPosition } from './photoPosition.entity';

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_REPOSITORY)
    private readonly photoRepository: typeof Photo,
  ) {}

  async create(photo: string, userId, sourceId, position): Promise<any> {
    // create directory if first time
    if (!existsSync('images')) {
      mkdirSync('images');
    }

    //remove tha base64 string and name, then create unique hashed name
    const basePict = photo.split(';base64,').pop();
    const hashSum = crypto.createHash('sha256');
    const hashPicture = hashSum.update(basePict).digest('hex');
    const imageName = `${hashPicture}.jpg`;

    // create in local or replace image if exist
    const localPath = join('images', `${hashPicture}.jpg`);
    writeFileSync(localPath, basePict, { encoding: 'base64' });

    //if admin creates, no source ID otherwise (profileId, userappId, progressId, feedbackId)
    const optionData =
      Object.entries(sourceId).length === 0
        ? { userId, hashPicture }
        : { ...sourceId, userId, hashPicture };
    //
    const [
      photoData,
      isCreated,
    ] = await this.photoRepository.findOrCreate<Photo>({
      where: { photo: imageName },
      defaults: optionData,
    });

    // check if this photo belongs to other user
    const isMyPhoto = await Photo.findOne({
      where: { photo: imageName, userId },
    });
    if (!isCreated && !isMyPhoto) {
      throw new NotFoundException(
        'some of photos not your or been used by other clients',
      );
    }
    // create positoin or update position(front, back, side) with source name (profile, userapp, progress, feedback)
    const [
      photoPositionData,
      isPositionCreated,
    ] = await PhotoPosition.findOrCreate({
      where: { photoId: photoData.id },
      defaults: position,
    });

    // if exists, update source ID (profileId, userappId, progressId, feedbackId)
    // if exists update photoPosition table also
    if (!isCreated && Object.entries(sourceId).length !== 0) {
      // update photo table
      const { numberOfAffectedRows, updatedPhoto } = await this.update(
        photoData.id,
        sourceId,
      );
      // update Position table
      const [positionRows, [updatedPOsition]] = await PhotoPosition.update(
        position,
        {
          where: { photoId: photoData.id },
          returning: true,
        },
      );
      // return updated if update otherwise return the found one(same source sending same photo more than once)
      if (numberOfAffectedRows > 0) {
        return {
          ...updatedPhoto.toJSON(),
          photo: `https://${process.env.DOMAIN_NAME}/${imageName}`,
          postitionData: updatedPOsition.get({ plain: true }),
        };
      } else {
        return {
          ...photoData.toJSON(),
          photo: `https://${process.env.DOMAIN_NAME}/${imageName}`,
          postitionData: position,
        };
      }
    } else {
      return {
        ...photoData.toJSON(),
        photo: `https://${process.env.DOMAIN_NAME}/${imageName}`,
        postitionData: photoPositionData.get({ plain: true }),
      };
    }
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

  async findAll(sourceId, position): Promise<any[]> {
    return await this.photoRepository
      .findAll<Photo>({ where: { ...sourceId }, include: [PhotoPosition] })
      .map((photo) => {
        const plainPhoto: any = photo.get({ plain: true });
        const { photoPosition, ...other } = plainPhoto;
        console.log(photoPosition);
        return {
          ...other,
          photo: `https://${process.env.DOMAIN_NAME}/${plainPhoto.photo}`,
          positoin: photoPosition[position],
        };
      });
  }

  async delete(id, userId, name, checkOtherIds, updateSourceId) {
    // check if all Ids (profile, userapp, progress, feedback)
    const findPhoto = await Photo.findOne({ where: { id, ...checkOtherIds } });
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
