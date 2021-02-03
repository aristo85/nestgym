import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { WorkoutProgram } from '../coach-modules/workout-programs/workout-program.entity';
import { User } from '../users/user.entity';

@Table
export class UserWorkout extends Model<UserWorkout> {
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  weight: number;
  //
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  dayDone: number;
  //
  @ForeignKey(() => WorkoutProgram)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  workoutprogramId: WorkoutProgram;
  //

  @BelongsTo(() => WorkoutProgram)
  workoutprogram: WorkoutProgram;
  //
}
