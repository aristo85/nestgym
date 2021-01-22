import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Aim } from '../aims/aim.entity';
import { CoachService } from '../coach-modules/coach-services/coach-service.entity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { Photo } from '../photos/photo.entity';
import { Sport } from '../sports/sport.entity';
import { UserProgress } from '../user-progress/user-progress.entity';
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

  @HasMany(() => DietProgram, 'coachId')
  dietprograms: DietProgram[];

  @HasMany(() => Aim, 'adminId')
  aims: Aim[];

  @HasMany(() => Sport, 'adminId')
  sports: Sport[];

  @HasMany(() => UserProgress, 'userId')
  userprogresses: UserProgress[];
}
