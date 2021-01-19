import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class CoachService extends Model<CoachService> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sportType: string;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  serviceType: string;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  valute: string;
  //
}
