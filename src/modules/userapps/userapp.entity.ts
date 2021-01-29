import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';

@Table
export class Userapp extends Model<Userapp> {
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  sportTypes: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  aim: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  place: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  serviceTypes: string[];

  @Column({
    type: DataType.STRING,
    values: ['male', 'female', 'any'],
    allowNull: false,
  })
  coachGender: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  equipments: string;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  priceMax: number;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  priceMin: number;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  healthIssue: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coment: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.JSON,
    // allowNull: false,
  })
  coachProfile: any;

  @HasOne(() => Requestedapp, { foreignKey: 'userappId', onDelete: 'CASCADE' })
  requestedapp: Requestedapp;
}
