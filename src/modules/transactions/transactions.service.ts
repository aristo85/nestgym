import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from 'src/core/constants';
import { UserappsService } from '../userapps/userapps.service';
import { AppPayment } from './appPaymetn.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly appPaymentRepository: typeof AppPayment,
    private readonly userappService: UserappsService,
  ) {}
  /////////////////////////////////////////////
  async clientResponseToPayOrReject(
    userappId: number,
    responseStatus: string,
    regular: boolean,
    comment: string,
  ) {
    if (responseStatus === 'reject') {
      const dataUpdate = { comment: comment, status: 'archived' };
      // update
      const [
        numberOfAffectedRows,
        [updatedApplication],
      ] = await this.userappService.updateUserappForPayment(
        userappId,
        dataUpdate,
      );
      return updatedApplication;
    }

    // set expireDate to 30 days or undefined
    const expiresAt = new Date().getTime() + 2592000000;
    const expireDate = regular ? expiresAt : undefined;

    if (responseStatus === 'accept') {
      // TODO: Payment

      const dataUpdate = { status: 'active', expireDate };
      // update
      const [
        numberOfAffectedRows,
        [updatedApplication],
      ] = await this.userappService.updateUserappForPayment(
        userappId,
        dataUpdate,
      );
      return updatedApplication;
    }
  }
}
