import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoData, PhotoDto } from 'src/modules/photos/dto/photo.dto';

export class ProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly height: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty({ enum: ['female', 'male'] })
  @IsNotEmpty()
  readonly gender: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly photos: PhotoData[];
}

// update
export class ProfileUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly height: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty({ enum: ['female', 'male'] })
  @IsNotEmpty()
  readonly gender: string;
}
