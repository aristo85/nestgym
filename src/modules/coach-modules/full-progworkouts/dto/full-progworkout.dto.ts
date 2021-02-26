import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface Exercise {
  exerciseName: string;
  sets: number;
  reps: number;
  value: number;
}

export interface Workout {
  description: string;
  workoutNumber: number;
  exercises: Exercise[];
}

export interface WorkoutProgram {
  dayNumber: number;
  workout: Workout[];
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
  readonly workoutProgram: WorkoutProgram[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  @IsNotEmpty()
  readonly userappIds: number[];
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
  readonly workoutProgram: WorkoutProgram[];
}
