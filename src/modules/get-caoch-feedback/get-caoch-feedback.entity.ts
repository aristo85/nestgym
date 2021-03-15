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
export class GCFeedback extends Model<GCFeedback> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
  //
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  userName: string;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userId: number;
  //

  @BelongsTo(() => User)
  user: User;
  //
}
