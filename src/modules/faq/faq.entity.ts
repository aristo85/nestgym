import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class FAQ extends Model<FAQ> {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question: string;
  //
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  answer: string;
  //
}
