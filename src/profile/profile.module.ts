import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProfileController } from './profile.controller';
import { profileProviders } from './profile.providers';
import { ProfileService } from './profile.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService, ...profileProviders],
})
export class ProfileModule {}
