import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { CoachProfile } from '../coach-modules/coach-profiles/coach-profile.entity';
import { Profile } from '../profiles/profile.entity';
import { Userapp } from '../userapps/userapp.entity';
import { User } from '../users/user.entity';

@Table
export class Requsetedapp extends Model<Requsetedapp> {
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  status: string;
  //
  @Column({
    type: DataType.DATE,
    // allowNull: false,
  })
  lastViewed: Date;
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
  @ForeignKey(() => Userapp)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userappId: number;
  // 
  @BelongsTo(() => User)
  user: User;
  // 
  @BelongsTo(() => Userapp)
  userapp: Userapp;
  //
}
