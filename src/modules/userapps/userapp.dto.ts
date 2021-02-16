import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoData } from '../photos/dto/photo.dto';
import { Userapp } from './userapp.entity';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';


export interface createPromise {
  createdUserapp: Userapp;
  matches: CoachProfile[];
}

export type RetApp = Userapp | {dietprograms: any}

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
