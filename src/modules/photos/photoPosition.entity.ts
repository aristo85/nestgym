import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Photo } from './photo.entity';

@Table
export class PhotoPosition extends Model<PhotoPosition> {
  @Column({
    type: DataType.STRING,
  })
  profile: string;
  @Column({
    type: DataType.STRING,
  })
  userapp: string;
  @Column({
    type: DataType.STRING,
  })
  progress: string;
  @Column({
    type: DataType.STRING,
  })
  feedback: string;
  
  @ForeignKey(() => Photo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  photoId: number;
}
