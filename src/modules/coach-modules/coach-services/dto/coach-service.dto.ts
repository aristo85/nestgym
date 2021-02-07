import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoachServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly sportType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly serviceType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly valute: string;
}
