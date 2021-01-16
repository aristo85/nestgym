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
export class Article extends Model<Article> {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  head: string;
  //
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  body: string;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coachId: number;
  //

  @BelongsTo(() => User)
  user: User;
  //
}
