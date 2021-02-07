import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class UserProgress extends Model<UserProgress> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  waist: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chest: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hips: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  thigh: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sholder: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  calf: number;
  //
}
