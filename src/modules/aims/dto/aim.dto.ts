import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AimDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string;
}
