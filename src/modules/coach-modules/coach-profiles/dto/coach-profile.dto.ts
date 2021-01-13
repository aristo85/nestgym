import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoachProfileDto {
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
}
