import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Profile extends Model<Profile> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    height: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    weight: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    age: number;

    @Column({
        type: DataType.ENUM,
        values: ['male', 'female'],
        allowNull: false
    })
    gender: string
}