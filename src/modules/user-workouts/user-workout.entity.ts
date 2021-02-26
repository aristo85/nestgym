import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { Workout } from './dto/user-workout.dto';

@Table
export class UserWorkout extends Model<UserWorkout> {
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  dayDone: number;
  //
  @Column({
    type: DataType.JSONB,
    // allowNull: false,
  })
  workoutList: Workout[];
  //
}
