import { Table, Column, Model, HasOne } from 'sequelize-typescript';
import { User } from 'src/user/user.entity';

@Table
export class Profile extends Model {
  @Column({
    allowNull: false,
  })
  height: number;

  @Column({
    allowNull: false,
  })
  weight: number;

  @Column({
    allowNull: false,
  })
  age: number;

  @Column({
    allowNull: false,
  })
  gender: string;

  @HasOne(() => User)
  user: User;
}

/****************************************** */
