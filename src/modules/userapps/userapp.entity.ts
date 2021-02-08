import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  ForeignKey,
} from 'sequelize-typescript';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { UserWorkout } from '../user-workouts/user-workout.entity';
import { Photo } from '../photos/photo.entity';

@Table
export class Userapp extends Model<Userapp> {
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
    type: DataType.STRING,
    values: ['male', 'female', 'any'],
    allowNull: false,
  })
  coachGender: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  equipments: string;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  priceMax: number;

  @Column({
    type: DataType.INTEGER,
    // allowNull: false,
  })
  priceMin: number;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  healthIssue: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  coment: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  status: string;

  @HasMany(() => Requestedapp, { foreignKey: 'userappId', onDelete: 'CASCADE' })
  requestedapps: Requestedapp[];

  @HasMany(() => FullProgWorkout, {
    foreignKey: 'userappId',
    onDelete: 'CASCADE',
  })
  fullprogworkouts: FullProgWorkout[];

  @HasMany(() => UserWorkout, 'userappId')
  userworkouts: UserWorkout[];

  @HasMany(() => DietProgram, {
    foreignKey: 'userappId',
    onDelete: 'CASCADE',
  })
  dietprograms: DietProgram[];

  @ForeignKey(() => CoachProfile)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  coachId: number;

  @HasMany(() => Photo, 'userappId')
  photos: Photo[];
}
