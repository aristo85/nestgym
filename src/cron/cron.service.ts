import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoachappsService } from 'src/modules/coach-modules/coachapps/coachapps.service';
import { UserappsService } from 'src/modules/userapps/userapps.service';

@Injectable()
export class CronService {
  constructor(
    private readonly coachappsService: CoachappsService,
    private readonly userappsService: UserappsService,
  ) {}
  @Cron('60 * * * *')
  async runEveryHour() {
    await this.coachappsService.checkRequestExpireForCron();
    await this.userappsService.checkUserappExpirationForCron();
    await this.userappsService.checkUserappExpirationPaymentForCron();
    console.log('everyHour');
  }
}
