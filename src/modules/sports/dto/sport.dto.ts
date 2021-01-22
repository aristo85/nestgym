import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SportDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly sport: string;
}
