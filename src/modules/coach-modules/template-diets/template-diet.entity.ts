import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { DayDietProgram } from '../dietprogram/dto/dietprogram.dto';

@Table
export class TemplateDiet extends Model<TemplateDiet> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  dietType: string;
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  aim: string;
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coment: string;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dailyRate: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  protein: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  fats: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  carbs: number;
  //

  @Column({
    type: DataType.JSONB,
    // allowNull: false,
  })
  days: DayDietProgram[];
}
