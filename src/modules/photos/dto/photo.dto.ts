import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface PhotoData {
  photo: string;
  position: string;
}
export interface PhotoList {
  photo: string;
  position: string;
}

export class PhotoDto {
  @ApiProperty({
    description: ` example: [
    {
      photo: string,
      position: string,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly photos: PhotoList[];
}

