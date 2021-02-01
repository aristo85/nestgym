import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface WorkoutProg {
  workout: string;
  sets: number;
  reps: number;
  weight: number;
  dayNumber: number;
  coment: string;
}

export class FullProgWorkoutDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  // @IsNotEmpty()
  readonly dayDone: number;
  
  @ApiProperty()
  // @IsNotEmpty()
  readonly workoutsPerWeek: number;

  @ApiProperty()
  //   @IsNotEmpty()
  readonly coment: string;

  @ApiProperty({
    description: ` example: [
    {
        workout: string,
        sets: number,
        reps: number,
        weight: number,
        dayNumber: number,
        coment: string,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly programs: WorkoutProg[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsNotEmpty()
  readonly clientIds: number[];
}

// //////
export class FullProgWorkoutUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  // @IsNotEmpty()
  readonly dayDone: number;

  @ApiProperty()
  // @IsNotEmpty()
  readonly workoutsPerWeek: number;

  @ApiProperty()
  //   @IsNotEmpty()
  readonly coment: string;

  @ApiProperty({
    description: ` example: [
    {
        workout: string,
        sets: number,
        reps: number,
        weight: number,
        dayNumber: number,
        coment: string,
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
