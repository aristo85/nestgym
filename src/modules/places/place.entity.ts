import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Place extends Model<Place> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  place: string;
}
