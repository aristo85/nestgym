import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  NotNull,
  Unique,
} from 'sequelize-typescript';
import { CoachApplication } from 'src/coach-aplication/coach-aplication.entity';
import { Profile } from 'src/profile/profile.entity';

@Table
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column({
    allowNull: false,
  })
  username: string;

  @Column({
    allowNull: false,
  })
  role: string;

  @Column({
    allowNull: false,
  })
  phone: number;

  @Column({
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    allowNull: false,
  })
  password: string;

  // @BelongsTo(() => Profile)
  // profle: Profile;

  @ForeignKey(() => Profile)
  @Unique
  @PrimaryKey
  @Column({
    allowNull: false,
  })
  profileId: number;

  @ForeignKey(() => CoachApplication)
  @Column({
    unique: true,
    allowNull: false,
  })
  applicationId: number;

  // @BelongsTo(() => CoachApplication)
  // coachApplications: CoachApplication;

  //   @ForeignKey(() => Photos)
  //   @Column
  //   photosId: number;
}
