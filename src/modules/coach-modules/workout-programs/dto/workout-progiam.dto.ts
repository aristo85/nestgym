import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WorkoutProgramDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly dayNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly workout: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly sets: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly reps: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty()
  //   @IsNotEmpty()
  readonly coment: string;
}
