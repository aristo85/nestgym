import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity';
import { Photo } from '../photos/photo.entity';
import { Userapp } from '../userapps/userapp.entity';

export type RatingCounter = { total: number; count: number } | Feedback;

@Table
export class Feedback extends Model<Feedback> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rate: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;
  //
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  clientName: string;
  //
  //
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coachName: string;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coachId: number;
  //
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
  //

  @BelongsTo(() => Userapp, { as: 'userapp', foreignKey: 'userappId' })
  @BelongsTo(() => User)
  user: User;
  //

  @BelongsTo(() => Photo, { foreignKey: 'frontPhotoId' })
  frontPhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'sidePhotoId' })
  sidePhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'backPhotoId' })
  backPhoto: Photo;
}
