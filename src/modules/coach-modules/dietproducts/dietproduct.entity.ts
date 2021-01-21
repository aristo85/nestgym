import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class DietProduct extends Model<DietProduct> {
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
  amount: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  measure: string;
  //
  // @ForeignKey(() => Userapp)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  // })
  // userappId: number;
  // //

  // @BelongsTo(() => Userapp)
  // userapp: Userapp;
  // //
}
