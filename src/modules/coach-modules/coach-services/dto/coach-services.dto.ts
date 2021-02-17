import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CoachServiceDto } from './coach-service.dto';

export class CoachServicesDto {
  @ApiProperty({
    description: `[{
      sportType: string,
      serviceType: string,
      price: number,
      valute: string,
    }, ...]`,
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsNotEmpty()
  readonly services: CoachServiceDto[];
}
