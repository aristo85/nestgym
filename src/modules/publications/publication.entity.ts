import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Article extends Model<Article> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  head: string;
  //
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  body: string;
  //
}
