import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Photo extends Model<Photo> {
  @Column({
    type: DataType.CHAR,
    // allowNull: false,
  })
  photoFileName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  photoURL: string;

  @Column({
    type: DataType.TEXT,
    // allowNull: false,
  })
  hashPicture: string;
}
