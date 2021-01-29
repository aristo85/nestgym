import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServicioDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly service: string;
}
