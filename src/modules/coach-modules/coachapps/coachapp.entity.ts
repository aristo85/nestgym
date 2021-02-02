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
export class Requestedapp extends Model<Requestedapp> {
  @Column({
    type: DataType.DATE,
    // allowNull: false,
  })
  lastViewed: Date;
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
  @ForeignKey(() => Userapp)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userappId: number;
  //
  @Column({
    type: DataType.STRING,
    values: ['pending', 'rejected', 'accepted'],
    allowNull: true,
    defaultValue: 'pending',
  })
  status: string;
  //
  // @Column
  // @BelongsTo(() => User)
  // user: User;
  //
  @BelongsTo(() => Userapp)
  userapp: Userapp;
}
