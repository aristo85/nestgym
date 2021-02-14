import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { User } from 'src/modules/users/user.entity';
import { Photo } from 'src/modules/photos/photo.entity';
import { CoachService } from '../coach-services/coach-service.entity';

// creating two tables (Coach profiles and coach services)
@Table
export class CoachProfile extends Model<CoachProfile> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  sportTypes: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  aim: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  place: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  serviceTypes: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  aboutme: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  education: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  experience: string;

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
  coachGender: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  submitList: string[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CoachService, {
    foreignKey: 'coachProfileId',
    onDelete: 'CASCADE',
  })
  coachservices: CoachService[];

  @BelongsTo(() => Photo, { foreignKey: 'frontPhotoId' })
  frontPhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'sidePhotoId' })
  sidePhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'backPhotoId' })
  backPhoto: Photo;
}
