import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface WorkoutProg {
  workout: string;
  sets: number;
  reps: number;
  value: number;
  dayNumber: number;
}

export class TemplateWorkoutDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  readonly workoutsPerWeek: number;

  @ApiProperty({
    description: ` example: [
    {
        workout: string,
        sets: number,
        reps: number,
        value: number,
        dayNumber: number,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly programs: WorkoutProg[];
}
// ///////
export class TemplateWorkoutUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  readonly workoutsPerWeek: number;

  @ApiProperty({
    description: ` example: [
    {
        workout: string,
        sets: number,
        reps: number,
        value: number,
        dayNumber: number,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly programs: WorkoutProg[];
}
