import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Photo } from '../photos/photo.entity';
import { User } from '../users/user.entity';

@Table
export class Profile extends Model<Profile> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fullName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  height: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  weight: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age: number;

  @Column({
    type: DataType.STRING,
    values: ['male', 'female'],
    allowNull: false,
  })
  gender: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Photo, { foreignKey: 'frontPhotoId' })
  frontPhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'sidePhotoId' })
  sidePhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'backPhotoId' })
  backPhoto: Photo;
}
