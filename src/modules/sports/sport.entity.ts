import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Sport extends Model<Sport> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sport: string;
}
