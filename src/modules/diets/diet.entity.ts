import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Diet extends Model<Diet> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  diet: string;
}
