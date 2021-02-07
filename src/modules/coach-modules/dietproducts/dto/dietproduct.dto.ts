import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DietProductDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly dayNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly product: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly amount: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly measure: string;
}
