import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserWorkout } from 'src/modules/user-workouts/user-workout.entity';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { User } from 'src/modules/users/user.entity';
import { WorkoutProgram } from './dto/full-progworkout.dto';
// import { WorkoutProgram } from '../workout-programs/workout-program.entity';

@Table
export class FullProgWorkout extends Model<FullProgWorkout> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
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
  //
  @Column({
    type: DataType.JSONB,
    // allowNull: false,
  })
  workoutProgram: WorkoutProgram[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  //
  @ForeignKey(() => Userapp)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userappId: number;

  @BelongsTo(() => Userapp)
  userapp: Userapp;

  // //
  // @HasMany(() => WorkoutProgram, {
  //   foreignKey: 'fullprogworkoutId',
  //   onDelete: 'CASCADE',
  // })
  // workoutprograms: WorkoutProgram[];

  @HasMany(() => UserWorkout, {
    foreignKey: 'fullprogworkoutId',
    onDelete: 'CASCADE',
  })
  userworkouts: UserWorkout[];
}
