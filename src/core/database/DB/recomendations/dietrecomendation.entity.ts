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
export class DietRecomendation extends Model<DietRecomendation> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dayNumber: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product: string;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  measure: string;
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
