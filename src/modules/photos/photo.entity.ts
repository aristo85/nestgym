import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { PhotoPosition } from './photoPosition.entity';

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

  @HasOne(() => PhotoPosition, { foreignKey: 'photoId', onDelete: 'CASCADE' })
  photoPosition: PhotoPosition;
}
