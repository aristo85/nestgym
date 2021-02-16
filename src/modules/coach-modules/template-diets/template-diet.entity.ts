import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity';
import { DietProduct } from '../dietproducts/dietproduct.entity';

@Table
export class TemplateDiet extends Model<TemplateDiet> {
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
 
  @HasMany(() => DietProduct, {
    foreignKey: 'templateDietId',
    onDelete: 'CASCADE',
  })
  dietproducts: DietProduct[];
}
