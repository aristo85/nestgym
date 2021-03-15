import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class ForgotPassword extends Model<ForgotPassword> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;
}
