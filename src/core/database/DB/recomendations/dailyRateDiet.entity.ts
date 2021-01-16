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
export class DailyRateDiet extends Model<DailyRateDiet> {
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
  dailyRate: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  protein: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  fats: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  carbs: number;
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
