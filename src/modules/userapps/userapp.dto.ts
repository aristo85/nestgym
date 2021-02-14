import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoData } from '../photos/dto/photo.dto';

export class UserappDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly sportTypes: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly place: string[];

  @ApiProperty()
  @IsNotEmpty()
  readonly serviceTypes: string[];

  @ApiProperty({ enum: ['female', 'male', 'any'] })
  @IsNotEmpty()
  readonly coachGender: string;

  @ApiProperty()
  readonly equipments: string;

  @ApiProperty()
  readonly priceMax: number;

  @ApiProperty()
  readonly priceMin: number;

  @ApiProperty()
  readonly healthIssue: string;

  @ApiProperty()
  readonly coment: string;

  @ApiProperty()
  readonly status: string;

}
