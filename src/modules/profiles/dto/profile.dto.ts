import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly height: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly age: number;

  @ApiProperty({ enum: ['female', 'male'] })
  @IsNotEmpty()
  readonly gender: string;
}
