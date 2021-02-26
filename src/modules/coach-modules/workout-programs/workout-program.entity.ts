import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

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
}
