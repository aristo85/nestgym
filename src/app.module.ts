import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { CoachAplicationModule } from './coach-aplication/coach-aplication.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProfileModule,
    CoachAplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
