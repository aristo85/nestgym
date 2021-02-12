import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Userapp } from 'src/modules/userapps/userapp.entity';
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

  @Column({
    type: DataType.JSON,
    // allowNull: false,
  })
  days: JSON;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  coachId: number;

  @BelongsTo(() => User)
  user: User;
  //
  @ForeignKey(() => Userapp)
  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  userappId: number;

  @BelongsTo(() => Userapp)
  userapp: Userapp;

  @HasMany(() => DietProduct, {
    foreignKey: 'dietProgramId',
    onDelete: 'CASCADE',
  })
  dietproducts: DietProduct[];
}
