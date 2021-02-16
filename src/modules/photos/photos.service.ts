import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { PHOTO_REPOSITORY } from '../../core/constants';
import { Photo } from './photo.entity';
import { PhotoData, PhotoDto } from './dto/photo.dto';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';

@Injectable()
export class PhotosService {
  constructor(
    @Inject(PHOTO_REPOSITORY)
    private readonly photoRepository: typeof Photo,
  ) {}

  getLocalPath(photoFileName: string): string {
    return join('images', `${photoFileName}`);
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
    const photoFileName = `${hashPicture}.jpg`;
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
    });

    return photo;
  }

  async findOneById(id: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
    });

    return photo;
  }

  async delete(id) {
    // check if all Ids (profile, userapp, progress, feedback)
    const photo = await this.findOneById(id);
    // if only  belongs to source ID, then delete it from everywhere, otherwise update sourceId to null
    const localPath = this.getLocalPath(photo.photoFileName);
    try {
      unlinkSync(localPath);
      //file removed
    } catch (err) {
      console.error(err);
    }
    return await this.photoRepository.destroy({ where: { id } });
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

  async findAll(): Promise<Photo[]> {
    return await this.photoRepository.findAll<Photo>();
  }

  async findAllThreePostion(data) {
    const frontPhoto =
      data.frontPhotoHash && (await this.findOneByHash(data.frontPhotoHash));
    const sidePhoto =
      data.sidePhotoHash && (await this.findOneByHash(data.sidePhotoHash));
    const backPhoto =
      data.backPhotoHash && (await this.findOneByHash(data.backPhotoHash));

    return { frontPhoto, sidePhoto, backPhoto };
  }
}
