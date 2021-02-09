import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Photo extends Model<Photo> {
  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  photo: string;
  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  hashPicture: string;
}
