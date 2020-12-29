import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Userapp } from '../userapps/userapp.entity';
import {Role} from './dto/user.dto'
@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.ENUM,
    values: ['admin', 'user', 'trainer'],
    allowNull: false,
  })
  role: string;

  @Column({
    allowNull: false,
  })
  phone: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: Role;

  @HasMany(() => Userapp)
  userapps: Userapp[];
}
