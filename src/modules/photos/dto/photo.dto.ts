import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly photoPath: string;
}
