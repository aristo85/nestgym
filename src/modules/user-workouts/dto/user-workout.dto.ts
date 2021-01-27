import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserWorkoutDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly lastWeight: number;
}
///////////////////////////////

export interface Workout {
  id: number;
  lastWeight: number;
}

export class WorkoutProgUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly dayDone: number;

  @ApiProperty({
    description: ` example: [
    {
      id: 1,
      lastWeight: 55,
    },
    {
      id: 2,
      lastWeight: 60,
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
