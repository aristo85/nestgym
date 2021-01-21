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
  export class WorkoutProgram extends Model<WorkoutProgram> {
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    dayNumber: number;
    //
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    workout: string;
    //
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    sets: number;
    //
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    reps: number;
    //
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    weight: number;
    //
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    coment: string;
    //
    // @ForeignKey(() => Userapp)
    // @Column({
    //   type: DataType.INTEGER,
    //   allowNull: false,
    // })
    // userappId: number;
    // //
  
    // @BelongsTo(() => Userapp)
    // userapp: Userapp;
    //
  }
  