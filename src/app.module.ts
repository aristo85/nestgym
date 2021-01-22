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
import { UserWorkoutsModule } from './modules/user-workouts/user-workouts.module';
import { DietproductsModule } from './modules/coach-modules/dietproducts/dietproducts.module';
import { DietprogramModule } from './modules/coach-modules/dietprogram/dietprogram.module';
import { SportsModule } from './modules/sports/sports.module';
import { AimsModule } from './modules/aims/aims.module';
import { UserDietsModule } from './modules/user-diets/user-diets.module';

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
    UserWorkoutsModule,
    DietproductsModule,
    DietprogramModule,
    SportsModule,
    AimsModule,
    UserDietsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
