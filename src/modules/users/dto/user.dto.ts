import { IsNotEmpty, MinLength, IsEmail, IsEnum, IsMobilePhone } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// type Role = 'user' | 'trainer' | 'admin';

export enum Role {
  admin = 'admin',
  user = 'user',
  trainer = 'trainer',
}

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ enum: ['admin', 'user', 'trainer'] })
  @IsNotEmpty()
  readonly role: Role;

  @ApiProperty()
  @IsNotEmpty()
  readonly phone: number;

  @ApiProperty({minLength: 6})
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
