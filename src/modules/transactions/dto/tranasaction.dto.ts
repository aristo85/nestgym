import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class clientPayOrRejectDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly coachId: number;

  @ApiProperty({ enum: ['accept', 'reject'] })
  @IsNotEmpty()
  readonly clientResponse: string;

  @ApiProperty()
  // @IsNotEmpty()
  readonly coment: string;
}
