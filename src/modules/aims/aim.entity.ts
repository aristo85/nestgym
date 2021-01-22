import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Aim extends Model<Aim> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  aim: string;
}
