import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

// export class Credential {
//   @ApiProperty()
//   @IsNotEmpty()
//   @IsEmail()
//   readonly email: string;

//   @ApiProperty({ minLength: 6 })
//   @IsNotEmpty()
//   @MinLength(6)
//   readonly password: string;
// }

// export class UserUpdateDto {
//   @ApiProperty()
//   @IsNotEmpty()
//   readonly name: string;

//   @ApiProperty({ enum: ['admin', 'user', 'trainer'] })
//   @IsNotEmpty()
//   readonly role: Role;

//   @ApiProperty()
//   @IsNotEmpty()
//   readonly phone: string;
// }
