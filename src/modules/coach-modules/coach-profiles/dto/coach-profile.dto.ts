import { IsNotEmpty } from 'class-validator';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CoachServiceDto } from '../../coach-services/dto/coach-service.dto';

export class CoachProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly sportTypes: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly aboutme: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly education: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly experience: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly height: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly place: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly serviceTypes: string[];

  @ApiProperty({
    description: ` example: [
    {
      sportType: 'string',
      serviceType: 'string',
      price: 555,
      valute: 'string',
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly coachServices: CoachServiceDto[];

  @ApiProperty({ enum: ['female', 'male'] })
  @IsNotEmpty()
  readonly coachGender: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly submitList: string[];

  @ApiProperty()
  readonly frontPhotoHash?: string;

  @ApiProperty()
  readonly sidePhotoHash?: string;

  @ApiProperty()
  readonly backPhotoHash?: string;
}
export class CoachProfileUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly sportTypes: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly aboutme: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly education: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly experience: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly height: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly place: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly serviceTypes: string[];

  @ApiProperty({ enum: ['female', 'male'] })
  @IsNotEmpty()
  readonly coachGender: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly submitList: string[];

  @ApiProperty({
    description: ` example: [
    {
      sportType: 'string',
      serviceType: 'string',
      price: 555,
      valute: 'string',
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly coachServices: CoachServiceDto[];

  @ApiProperty()
  readonly frontPhotoHash?: string;

  @ApiProperty()
  readonly sidePhotoHash?: string;

  @ApiProperty()
  readonly backPhotoHash?: string;
}
