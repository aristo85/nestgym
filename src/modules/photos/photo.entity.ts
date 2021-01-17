import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/user.entity';

@Table
export class Photo extends Model<Photo> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photoPath: string;
}
