import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { WorkoutProgram } from '../full-progworkouts/dto/full-progworkout.dto';
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
  sportType: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  aim: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coment: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  workoutsPerWeek: number;
  //
  @Column({
    type: DataType.JSONB,
    // allowNull: false,
  })
  workoutProgram: WorkoutProgram[];
}
