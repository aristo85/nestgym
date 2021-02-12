import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataType } from 'sequelize-typescript';
import { DataTypes } from 'sequelize/types';

export interface DietProd {
  product: string;
  amount: number;
  dayNumber: number;
  measure: string;
}

export class DietJsonDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly days: JSON;
}

export class DietProgramDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: ` example: [
    {
        product: string,
        amount: number,
        dayNumber: number,
        measure: string,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly days: JSON;

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
        product: string,
        amount: number,
        dayNumber: number,
        measure: string,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly programs: DietProd[];

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
}
