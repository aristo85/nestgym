import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity';
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
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coment: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;


  @HasMany(() => DietProduct, {
    foreignKey: 'dietProgramId',
    onDelete: 'CASCADE',
  })
  dietproducts: DietProduct[];
}
