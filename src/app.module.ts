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
import { FullProgworkoutsModule } from './modules/coach-modules/full-progworkouts/full-progworkouts.module';
import { UserWorkoutsModule } from './modules/user-workouts/user-workouts.module';
import { DietprogramModule } from './modules/coach-modules/dietprogram/dietprogram.module';
import { SportsModule } from './modules/sports/sports.module';
import { AimsModule } from './modules/aims/aims.module';
import { UserDietsModule } from './modules/user-diets/user-diets.module';
import { UserProgressModule } from './modules/user-progress/user-progress.module';
import { CoachProgressModule } from './modules/coach-modules/coach-progress/coach-progress.module';
import { TemplateWorkoutsModule } from './modules/coach-modules/template-workouts/template-workouts.module';
import { TemplateDietsModule } from './modules/coach-modules/template-diets/template-diets.module';
import { ServicesModule } from './modules/services/services.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    FullProgworkoutsModule,
    UserWorkoutsModule,
    DietprogramModule,
    SportsModule,
    AimsModule,
    UserDietsModule,
    UserProgressModule,
    CoachProgressModule,
    TemplateWorkoutsModule,
    TemplateDietsModule,
    ServicesModule,
    PublicationsModule,
    FeedbacksModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      exclude: ['/api/gym*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
