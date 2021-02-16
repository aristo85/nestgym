import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface DietProd {
  product: string;
  amount: number;
  dayNumber: number;
  measure: string;
}

export type RetTemplate = TemplateDietDto | { days: any };

export class TemplateDietDto {
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
  readonly days: DietProd[];

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
// //////
export class TemplateDietUpdateDto {
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
  readonly days: DietProd[];

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
