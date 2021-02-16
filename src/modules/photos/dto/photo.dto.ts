import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HasMany, HasOne } from 'sequelize-typescript';
import { Userapp } from 'src/modules/userapps/userapp.entity';

export interface PhotoData {
  photoFileName: string;
  hashPicture: string;
  photoURL: string;
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

  // @HasMany(() => Userapp)
  // frontPhoto: Userapp[]

  // @HasMany(() => Userapp)
  // sidePhoto: Userapp[]

  // @HasMany(() => Userapp)
  // backPhoto: Userapp[]
}
