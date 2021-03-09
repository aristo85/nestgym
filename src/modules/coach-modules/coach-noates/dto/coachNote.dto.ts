import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoachNoteDto {
  @ApiProperty()
  //   @IsNotEmpty()
  readonly note: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly userappId: string;
}
