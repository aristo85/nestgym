import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    ForeignKey,
  } from 'sequelize-typescript';
  import { Userapp } from 'src/modules/userapps/userapp.entity';
import { WorkoutOnDiet } from './recomendations/workoutOnDiet.entity';
  
  @Table
  export class DayBook extends Model<DayBook> {
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    dayNumber: number;
    //
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    weight: number;
    //
   
    @ForeignKey(() => Userapp)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    userappId: number;
    //
    @ForeignKey(() => WorkoutOnDiet)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    workoutDietId: number;
    //

    @BelongsTo(() => Userapp)
    userapp: Userapp;
    //
    @BelongsTo(() => WorkoutOnDiet)
    workoutDiet: WorkoutOnDiet;
    //
  }
  