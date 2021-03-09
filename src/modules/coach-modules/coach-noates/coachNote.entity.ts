import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Userapp } from 'src/modules/userapps/userapp.entity';

@Table
export class CoachNote extends Model<CoachNote> {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  note: string;
  //
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  coachId: number;
  //
  //   userappId: number;
  //   @BelongsTo(() => Userapp, { foreignKey: 'userappId' })
  //   userapp: Userapp;
}
