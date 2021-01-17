import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Userapp } from 'src/modules/userapps/userapp.entity';

@Table
export class CoachPayment extends Model<CoachPayment> {
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
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentId: string;
  //

  @ForeignKey(() => Userapp)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userappId: number;
  //

  @BelongsTo(() => Userapp)
  userapp: Userapp;
  //
}
