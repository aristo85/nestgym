import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
// import { WorkoutProgram } from '../workout-programs/workout-program.entity';

@Table
export class TemplateWorkout extends Model<TemplateWorkout> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  workoutsPerWeek: number;

  // //
  // @HasMany(() => WorkoutProgram, {
  //   foreignKey: 'templateworkoutId',
  //   onDelete: 'CASCADE',
  // })
  // workoutprograms: WorkoutProgram[];
}
