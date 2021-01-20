import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { Photo } from '../photos/photo.entity';
import { Userapp } from '../userapps/userapp.entity';
@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    values: ['admin', 'user', 'trainer'],
    allowNull: false,
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Userapp, 'userId')
  userapps: Userapp[];

  @HasMany(() => Photo, 'userId')
  photos: Photo[];

  @HasMany(() => CoachService, 'userId')
  coachServices: CoachService[];

  @HasMany(() => FullProgWorkout, 'coachId')
  fullprogworkouts: FullProgWorkout[];
}
