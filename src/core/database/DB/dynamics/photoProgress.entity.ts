import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Photo } from 'src/modules/photos/photo.entity';
import { User } from 'src/modules/users/user.entity';

@Table
export class PhotoProgress extends Model<PhotoProgress> {
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;
  //

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
  //
  @ForeignKey(() => Photo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  photoId: number;
  //
  @BelongsTo(() => User)
  user: User;
  //
  @BelongsTo(() => Photo)
  photo: Photo;
  //
}
