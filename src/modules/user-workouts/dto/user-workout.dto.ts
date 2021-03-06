import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface Workout {
  id: number;
  weight: number;
}
export class UserWorkoutDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly dayDone: number;

  @ApiProperty({
    description: ` example: [
    {
      id: 1,
      weight: 55,
    },
    {
      id: 2,
      weight: 60,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly workoutList: Workout[];
}
///////////////////////////////

export class WorkoutProgUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly dayDone: number;

  @ApiProperty({
    description: ` example: [
    {
      id: 1,
      weight: 55,
    },
    {
      id: 2,
      weight: 60,
    }, ...
  ]`,

    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly workoutList: Workout[];
}
