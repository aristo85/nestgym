import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CoachProfile } from '../coach-profiles/coach-profile.entity';

@Table
export class CoachService extends Model<CoachService> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sportType: string;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  serviceType: string;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price: number;
  //
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  valute: string;
  //


  @ForeignKey(() => CoachProfile)
  @Column
  coachProfileId: number;

  @BelongsTo(() => CoachProfile)
  coachProfile: CoachProfile;
}
