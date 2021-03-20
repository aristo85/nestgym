import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UserappsModule } from '../userapps/userapps.module';
import { transactionsProviders } from './transaction.providers';

@Module({
  providers: [TransactionsService, ...transactionsProviders],
  controllers: [TransactionsController],
  imports: [UserappsModule],
})
export class TransactionsModule {}
