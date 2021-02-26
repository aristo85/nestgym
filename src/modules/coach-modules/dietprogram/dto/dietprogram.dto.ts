import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType } from 'sequelize-typescript';
import { DataTypes } from 'sequelize/types';

export interface DietProduct {
  product: string;
  amount: number;
  measure: string;
}

export interface Diet {
  description: string;
  eatingNumber: number;
  dietproducts: DietProduct[];
}

export interface DayDietProgram {
  dayNumber: number;
  eating: Diet[];
}

export interface FinalData {
  title: string;
  days: any;
  dailyRate: number;
  protein: number;
  fats: number;
  carbs: number;
  coment: string;
  userappIds: number[];
}

export class DietProgramDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: ` example: [
      {
          "daynumber": 1,
          "eating": {
              "description": "test",
              "eatingNumer": 1,
              "dietproducts": []
          }
    }
  ], ...`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly days: DayDietProgram[];

  @ApiProperty()
  @IsNotEmpty()
  readonly dailyRate: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly protein: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly fats: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly carbs: number;

  @ApiProperty()
  //   @IsNotEmpty()
  readonly coment: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsNotEmpty()
  readonly userappIds: number[];
}

// ///
export class DietProgramUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: ` example: [
      {
          "daynumber": 1,
          "eating": {
              "description": "test",
              "eatingNumer": 1,
              "dietproducts": []
          }
    }
  ], ...`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly days: DayDietProgram[];

  @ApiProperty()
  @IsNotEmpty()
  readonly dailyRate: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly protein: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly fats: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly carbs: number;

  @ApiProperty()
  //   @IsNotEmpty()
  readonly coment: string;
}
