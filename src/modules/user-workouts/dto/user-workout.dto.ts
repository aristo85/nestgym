import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserWorkoutDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly lastWeight: number;
}
