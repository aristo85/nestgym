import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity';
import { WorkoutProgram } from '../workout-programs/workout-program.entity';

@Table
export class FullProgWorkout extends Model<FullProgWorkout> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  dayDone: number;
   //
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  workoutsPerWeek: number;
   //
   @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coment: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  //
  @HasMany(() => WorkoutProgram, {
    foreignKey: 'fullprogworkoutId',
    onDelete: 'CASCADE',
  })
  workoutprograms: WorkoutProgram[];
}
