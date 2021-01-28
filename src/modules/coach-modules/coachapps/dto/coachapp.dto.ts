import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestedappDto {
  @ApiProperty()
  // @IsNotEmpty()
  readonly lastViewed: Date;
}
export class CoachAnswerDto {
  @ApiProperty({ enum: ['accept', 'reject', 'archived']})
  @IsNotEmpty()
  readonly status: string;
}
