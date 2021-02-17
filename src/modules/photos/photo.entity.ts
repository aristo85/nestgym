import { Table, Column, Model, DataType, HasOne, HasMany } from 'sequelize-typescript';
import { Feedback } from '../feedbacks/feedback.entity';

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
  
  // @HasMany(() => Feedback)
  // frontPhoto: Feedback[]

  // @HasMany(() => Feedback)
  // sidePhoto: Feedback[]

  // @HasMany(() => Feedback)
  // backPhoto: Feedback[]
}
