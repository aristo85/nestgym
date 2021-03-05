import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface PhotoData {
  photoFileName: string;
  hashPicture: string;
  photoURL: string;
}

export enum photoPositionTypes {
  front = 'front',
  side = 'side',
  back = 'back',
}

export interface PhotoList {
  photo: string;
}

export class UpdatePhotoDto {
  @ApiProperty({
    description: ` example: [
      photoBase64String,
     ...]`,

    type: 'array',
    items: {
      type: 'TEXT',
    },
  })
  @IsNotEmpty()
  readonly photosBase64: string[];
}

export interface PhotoPositions {
  frontPhotoHash?: string;
  sidePhotoHash?: string;
  backPhotoHash?: string;
}

export class PhotoDto {
  @ApiProperty({
    description: `photo file name`,
    type: 'string',
  })
  @IsNotEmpty()
  readonly photoFileName: string;

  @ApiProperty({
    description: `photo URL`,
    type: 'string',
  })
  @IsNotEmpty()
  readonly photoURL: string;

  @ApiProperty({
    description: `photo HASH`,
    type: 'string',
  })
  @IsNotEmpty()
  readonly hashPicture: string;
}
