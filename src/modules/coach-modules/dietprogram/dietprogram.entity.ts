import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { DietProduct } from '../dietproducts/dietproduct.entity';

@Table
export class DietProgram extends Model<DietProgram> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;
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
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  clientIds: number[];
  //

  @HasMany(() => DietProduct, 'dietProgramId')
  dietproducts: DietProduct[];
}
