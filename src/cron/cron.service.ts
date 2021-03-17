import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('60 * * * *')
  runEvery10Seconds() {
    console.log('Every hour');
  }
}
