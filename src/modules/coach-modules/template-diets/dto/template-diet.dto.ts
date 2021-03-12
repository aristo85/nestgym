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

  @ApiProperty()
  @IsNotEmpty()
  readonly dietType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string;

  @ApiProperty()
  // @IsNotEmpty()
  readonly coment: string;

  @ApiProperty({
    description: ` example: [
      {
        "dayNumber": 1,
        "eating": [
            {
                "description": "Поесть куриное филе 500гр. в обед, стакан молока",
                "eatingNumber": 1,
                "dietproduct": "any",
                "amount": 500,
                "measure": "гр"
            }, ...
        ] 
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

  @ApiProperty()
  @IsNotEmpty()
  readonly dietType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string;

  @ApiProperty()
  // @IsNotEmpty()
  readonly coment: string;

  @ApiProperty({
    description: ` example: [
      {
        "dayNumber": 1,
        "eating": [
            {
                "description": "Поесть куриное филе 500гр. в обед, стакан молока",
                "eatingNumber": 1,
                "dietproduct": "any",
                "amount": 500,
                "measure": "гр"
            }, ...
        ] 
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
