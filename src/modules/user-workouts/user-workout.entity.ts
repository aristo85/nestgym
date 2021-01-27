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
    allowNull: false,
  })
  lastWeight: number;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: User;
  //

  @BelongsTo(() => User)
  user: User;
  //
}
