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
  @IsNotEmpty()
  readonly sportType: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly aim: string;

  @ApiProperty()
  readonly workoutsPerWeek: number;

  @ApiProperty({
    description: ` example: [
      {
        "dayNumber": 1,
            "workouts": [
                {
                    "description": "",
                    "workoutNumber": 1,
                    "exerciseName":"Планка",
                    "sets": 4,
                    "reps": 4,
                    "value": 4
                }
            ]
   }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly workoutProgram: WorkoutProg[];
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
        "dayNumber": 1,
            "workouts": [
                {
                    "description": "",
                    "workoutNumber": 1,
                    "exerciseName":"Планка",
                    "sets": 4,
                    "reps": 4,
                    "value": 4
                }
            ]
   }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly workoutProgram: WorkoutProg[];
}
