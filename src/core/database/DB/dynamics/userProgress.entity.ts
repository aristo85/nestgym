import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity';

@Table
export class UserProgress extends Model<UserProgress> {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  waist: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chest: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hips: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  thigh: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sholder: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  calf: number;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
  //
  @BelongsTo(() => User)
  user: User;
}
