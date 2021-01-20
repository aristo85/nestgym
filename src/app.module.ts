import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UserappsModule } from './modules/userapps/userapps.module';
import { PhotosModule } from './modules/photos/photos.module';
import { CoachProfilesModule } from './modules/coach-modules/coach-profiles/coach-profiles.module';
import { CoachappsModule } from './modules/coach-modules/coachapps/coachapps.module';
import { CoachServicesModule } from './modules/coach-modules/coach-services/coach-services.module';
import { WorkoutProgramsModule } from './modules/coach-modules/workout-programs/workout-programs.module';
import { FullProgworkoutsModule } from './modules/coach-modules/full-progworkouts/full-progworkouts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
    UserappsModule,
    PhotosModule,
    CoachProfilesModule,
    CoachappsModule,
    CoachServicesModule,
    WorkoutProgramsModule,
    FullProgworkoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
