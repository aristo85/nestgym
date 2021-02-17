import { IsNotEmpty,  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  readonly frontPhotoHash?: string;

  @ApiProperty()
  readonly sidePhotoHash?: string;

  @ApiProperty()
  readonly backPhotoHash?: string;
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

  @ApiProperty()
  readonly frontPhotoHash?: string;

  @ApiProperty()
  readonly sidePhotoHash?: string;

  @ApiProperty()
  readonly backPhotoHash?: string;
}
