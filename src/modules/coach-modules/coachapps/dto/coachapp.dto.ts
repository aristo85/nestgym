import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestedappDto {
  @ApiProperty()
  // @IsNotEmpty()
  readonly lastViewed: Date;
}
