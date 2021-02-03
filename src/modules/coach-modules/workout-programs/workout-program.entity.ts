import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';

@Table
export class WorkoutProgram extends Model<WorkoutProgram> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dayNumber: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  workout: string;
  //
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  sets: number;
  //
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  reps: number;
  //
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  value: number;

  @HasMany(() => UserWorkout, 'workoutprogramId')
  userworkouts: UserWorkout[];
  //
  // @ForeignKey(() => Userapp)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  // })
  // userappId: number;
  // //

  // @BelongsTo(() => Userapp)
  // userapp: Userapp;
  //
}
