import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { Requestedapp } from '../coach-modules/coachapps/coachapp.entity';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { FullProgWorkout } from '../coach-modules/full-progworkouts/full.progworkout.enity';
import { DietProgram } from '../coach-modules/dietprogram/dietprogram.entity';
import { UserWorkout } from '../user-workouts/user-workout.entity';
import { User } from '../users/user.entity';
import { Photo } from '../photos/photo.entity';
import { Profile } from '../profiles/profile.entity';
import { CoachNote } from '../coach-modules/coach-noates/coachNote.entity';
import { Feedback } from '../feedbacks/feedback.entity';

export type ApplicationStatus = 'active' | 'pending' | 'archieved' | 'reject';
export type ApplicationCoachGender = 'male' | 'female' | 'any';

@Table
export class Userapp extends Model<Userapp> {
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  sportType: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  aim: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  place: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  serviceType: string;

  @Column({
    type: DataType.STRING,
    values: ['male', 'female', 'any'],
    allowNull: false,
  })
  coachGender: ApplicationCoachGender;

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
    type: DataType.DATE,
    // allowNull: false,
  })
  expireDate: string;

  @Column({
    type: DataType.STRING,
    // allowNull: false,
    values: ['active', 'pending', 'archieved', 'reject', 'notPaid'],
  })
  status: ApplicationStatus;

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  coachId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  user: User;

  @BelongsTo(() => CoachProfile, { foreignKey: 'coachProfileId' })
  coachProfile: CoachProfile;

  @BelongsTo(() => Profile, { foreignKey: 'clientProfileId' })
  clientProfile: Profile;

  @BelongsTo(() => Photo, { foreignKey: 'frontPhotoId' })
  frontPhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'sidePhotoId' })
  sidePhoto: Photo;

  @BelongsTo(() => Photo, { foreignKey: 'backPhotoId' })
  backPhoto: Photo;

  @HasOne(() => CoachNote, { foreignKey: 'userappId' })
  coachNote: CoachNote;

  @HasOne(() => Feedback, { foreignKey: 'userappId' })
  feedback: Feedback;
}
