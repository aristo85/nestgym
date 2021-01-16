import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Userapp } from 'src/modules/userapps/userapp.entity';
import { User } from 'src/modules/users/user.entity';

@Table
export class AppPayment extends Model<AppPayment> {
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
  sum: number;
  //

  @ForeignKey(() => Userapp)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userappId: number;
  //
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
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
  @BelongsTo(() => Userapp)
  userapp: Userapp;
  //
}
