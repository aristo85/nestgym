import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.entity';

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
    type: DataType.ENUM,
    values: ['male', 'female'],
    allowNull: false,
  })
  coachGender: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  equipments: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  priceMax: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  priceMin: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  healthIssue: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  coment: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
