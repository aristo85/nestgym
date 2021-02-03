import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Photo } from 'src/modules/photos/photo.entity';
import { Feedback } from '../../../../modules/feedbacks/feedback.entity';

@Table
export class PhotoFeedback extends Model<PhotoFeedback> {
  @ForeignKey(() => Feedback)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  feedbakId: number;
  //
  @ForeignKey(() => Photo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  photoId: number;
  //
  @BelongsTo(() => Feedback)
  feedback: Feedback;
  //
  @BelongsTo(() => Photo)
  photo: Photo;
  //
}
