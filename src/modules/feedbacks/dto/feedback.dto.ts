import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly coachId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly userappId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly rate: number;

  @ApiProperty()
  readonly text: string;

  @ApiProperty()
  readonly frontPhotoHash?: string;

  @ApiProperty()
  readonly sidePhotoHash?: string;

  @ApiProperty()
  readonly backPhotoHash?: string;
}
