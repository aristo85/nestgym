import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { UserappsModule} from '../../userapps/userapps.module'
import { CoachProgressService } from './coach-progress.service';
import { CoachProgressController } from './coach-progress.controller';

@Module({
  providers: [CoachProgressService],
  imports: [UsersModule, UserappsModule],
  controllers: [CoachProgressController],
  exports: [CoachProgressService]
})
export class CoachProgressModule {}
