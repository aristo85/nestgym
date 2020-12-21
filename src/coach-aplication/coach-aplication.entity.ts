import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { User } from 'src/user/user.entity';

@Table
export class CoachApplication extends Model {
  @Column({
    allowNull: false,
    type: new DataTypes.ARRAY(DataTypes.STRING),
  })
  kindOfSport: string[];

  @Column({
    type: new DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  aim: string[];

  @Column({
    type: new DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  trainingPlace: string[];

  @Column({
    type: new DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  services: string[];

  @Column({
    allowNull: false,
  })
  trainerGender: string;

  @Column({
    type: new DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  })
  homeEquipment: string[];

  @Column({
    allowNull: false,
  })
  minCost: number;

  @Column({
    allowNull: false,
  })
  maxCost: number;

  @Column({
    allowNull: false,
  })
  medicalIssue: string;

  @Column({
    allowNull: false,
  })
  coment: string;

  @HasMany(() => User)
  user: User;
}
