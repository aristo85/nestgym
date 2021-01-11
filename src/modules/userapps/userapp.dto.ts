import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNotEmpty()
  readonly equipments: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly priceMax: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly priceMin: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly healthIssue: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly coment: string;
}
