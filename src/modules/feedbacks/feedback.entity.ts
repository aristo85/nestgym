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
export class Feedback extends Model<Feedback> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rate: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coachId: number;
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
  //
}
