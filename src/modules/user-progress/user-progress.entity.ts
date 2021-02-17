import { Table, Column, Model, DataType, HasMany, BelongsTo } from 'sequelize-typescript';
import { Photo } from '../photos/photo.entity';

@Table
export class UserProgress extends Model<UserProgress> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  waist: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chest: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hips: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  thigh: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sholder: number;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  calf: number;
  //
  
  @BelongsTo(() => Photo, { foreignKey: 'frontPhotoId' })
  frontPhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'sidePhotoId' })
  sidePhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'backPhotoId' })
  backPhoto: Photo;
}
