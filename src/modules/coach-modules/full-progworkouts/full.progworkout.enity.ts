import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';

@Table
export class FullProgWorkout extends Model<FullProgWorkout> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  clientIds: number[];

  //
  @HasMany(() => WorkoutProgram, 'fullprogworkoutId')
  workoutprograms: WorkoutProgram[];
}
