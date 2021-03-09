import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DietDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly diet: string;
}
