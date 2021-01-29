import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Servicio extends Model<Servicio> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  service: string;
}
