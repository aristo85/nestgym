import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Photo } from '../photos/photo.entity';

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
  @Column({
    type: DataType.INTEGER,
  })
  publicationNumber: number;
  //
  // @HasMany(() => Photo, 'photoId')
  // photos: Photo[];
}
