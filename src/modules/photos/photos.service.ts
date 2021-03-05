import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PHOTO_REPOSITORY } from '../../core/constants';
import { Photo } from './photo.entity';
import { PhotoData, PhotoDto, PhotoPositions } from './dto/photo.dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';
import { Profile } from '../profiles/profile.entity';
import { Op } from 'sequelize';
import { UserProgress } from '../user-progress/user-progress.entity';
import { Userapp } from '../userapps/userapp.entity';
import { Feedback } from '../feedbacks/feedback.entity';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';

export const includePhotoOptions = [
  { model: Photo, as: 'frontPhoto' },
  { model: Photo, as: 'sidePhoto' },
  { model: Photo, as: 'backPhoto' },
];

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_REPOSITORY)
    private readonly photoRepository: typeof Photo,
  ) {}

  getLocalPath(photoFileName: string): string {
    return join('images', `${photoFileName}`).trim();
  }

  async create(photo: string): Promise<Photo> {
    // create directory if first time
    if (!existsSync('images')) {
      mkdirSync('images');
    }

    //remove tha base64 string and name, then create unique hashed name
    const basePict = photo.split(';base64,').pop();
    const hashSum = crypto.createHash('sha256');
    const hashPicture = hashSum.update(basePict).digest('hex');
    const photoFileName = `${hashPicture}.jpg`.trim();
    const photoURL = `https://${process.env.DOMAIN_NAME}/${photoFileName}`;

    // create in local or replace image if exist
    const localPath = this.getLocalPath(photoFileName);
    writeFileSync(localPath, basePict, { encoding: 'base64' });
    const defaults: PhotoDto = {
      photoFileName,
      hashPicture,
      photoURL: photoURL,
    };

    const [
      photoData,
      isCreated,
    ] = await this.photoRepository.findOrCreate<Photo>({
      where: { photoFileName: photoFileName },
      defaults,
    });

    return photoData;
  }

  async findOneByHash(hashPicture: string): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { hashPicture },
      raw: true,
      nest: true,
    });

    return photo;
  }

  async findOneById(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });

    return photo;
  }

  async deletePhoto(photoId: number, photoFileName: string) {
    // check if all Ids (profile, userapp, progress, feedback)
    if (await this.checkPhotoRedundancy(photoId)) {
      return 0;
    }
    // if only  belongs to source ID, then delete it from everywhere, otherwise update sourceId to null
    const localPath = this.getLocalPath(photoFileName);
    try {
      unlinkSync(localPath);
      //file removed
    } catch (err) {
      console.error(err);
    }
    return await this.photoRepository.destroy({ where: { id: photoId } });
  }

  async update(photoId: number, data: PhotoDto) {
    const [
      numberOfAffectedRows,
      [updatedPhoto],
    ] = await this.photoRepository.update(
      { ...data },
      { where: { id: photoId }, returning: true },
    );

    return { numberOfAffectedRows, updatedPhoto };
  }

  async findAll(): Promise<Photo[]> {
    return await this.photoRepository.findAll<Photo>();
  }

  /////////////////////////////
  ///////////////////////////////

  async findAllThreePostion(data: PhotoPositions) {
    const frontPhoto =
      data.frontPhotoHash && (await this.findOneByHash(data.frontPhotoHash));
    const sidePhoto =
      data.sidePhotoHash && (await this.findOneByHash(data.sidePhotoHash));
    const backPhoto =
      data.backPhotoHash && (await this.findOneByHash(data.backPhotoHash));

    return { frontPhoto, sidePhoto, backPhoto };
  }

  // check if photo is belong to other modules
  async checkPhotoRedundancy(photoId: number): Promise<boolean> {
    const opOptions = {
      frontPhotoId: photoId,
      sidePhotoId: photoId,
      backPhotoId: photoId,
    };

    if (
      (await Profile.findOne({ where: { [Op.or]: opOptions } })) ||
      (await UserProgress.findOne({ where: { [Op.or]: opOptions } })) ||
      (await Userapp.findOne({ where: { [Op.or]: opOptions } })) ||
      (await Feedback.findOne({ where: { [Op.or]: opOptions } })) ||
      (await CoachProfile.findOne({ where: { [Op.or]: opOptions } }))
    ) {
      return true;
    } else {
      return false;
    }
  }

  async checkPhotoPositionsAndDelete(frontPhoto, sidePhoto, backPhoto) {
    frontPhoto.id &&
      (await this.deletePhoto(frontPhoto.id, frontPhoto.photoFileName));
    sidePhoto.id &&
      (await this.deletePhoto(sidePhoto.id, sidePhoto.photoFileName));
    backPhoto.id &&
      (await this.deletePhoto(backPhoto.id, backPhoto.photoFileName));
  }
}
