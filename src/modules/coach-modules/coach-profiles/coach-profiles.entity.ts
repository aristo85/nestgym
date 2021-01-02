import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class CoachProfile extends Model<CoachProfile> {
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  sportTypes: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  aboutme: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  education: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  experience: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  height: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  weight: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age: number;

  @Column({
    type: DataType.ENUM,
    values: ['male', 'female'],
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  submitList: string[];
}
