import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FAQDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly question: string;
  //
  @ApiProperty()
  @IsNotEmpty()
  readonly answer: string;
}
