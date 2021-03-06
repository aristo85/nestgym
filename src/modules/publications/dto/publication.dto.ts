import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly head: string;
  //
  @ApiProperty()
  @IsNotEmpty()
  readonly body: string;
}
