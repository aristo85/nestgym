import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly place: string;
}
