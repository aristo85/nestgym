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
    type: DataType.INTEGER,
    allowNull: false,
  })
  sum: number;
  //

  @BelongsTo(() => Userapp, { foreignKey: 'userappId' })
  userapp: Userapp;
  //
  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;
  //
  @BelongsTo(() => User, { foreignKey: 'coachId' })
  coach: User;
  //
}
