import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserProgressDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly waist: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly chest: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly hips: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly thigh: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly sholder: number;

  @ApiProperty()
  readonly calf: number;
}
