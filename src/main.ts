import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AimsModule } from './modules/aims/aims.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoachNoatesModule } from './modules/coach-modules/coach-noates/coach-noates.module';
import { CoachProfilesModule } from './modules/coach-modules/coach-profiles/coach-profiles.module';
import { CoachProgressModule } from './modules/coach-modules/coach-progress/coach-progress.module';
import { CoachServicesModule } from './modules/coach-modules/coach-services/coach-services.module';
import { CoachappsModule } from './modules/coach-modules/coachapps/coachapps.module';
import { DietprogramModule } from './modules/coach-modules/dietprogram/dietprogram.module';
import { FullProgworkoutsModule } from './modules/coach-modules/full-progworkouts/full-progworkouts.module';
import { TemplateDietsModule } from './modules/coach-modules/template-diets/template-diets.module';
import { TemplateWorkoutsModule } from './modules/coach-modules/template-workouts/template-workouts.module';
import { DietsModule } from './modules/diets/diets.module';
import { FaqModule } from './modules/faq/faq.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { GetCaochFeedbackModule } from './modules/get-caoch-feedback/get-caoch-feedback.module';
import { PhotosModule } from './modules/photos/photos.module';
import { PlacesModule } from './modules/places/places.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { ServicesModule } from './modules/services/services.module';
import { SportsModule } from './modules/sports/sports.module';
import { UserDietsModule } from './modules/user-diets/user-diets.module';
import { UserProgressModule } from './modules/user-progress/user-progress.module';
import { UserWorkoutsModule } from './modules/user-workouts/user-workouts.module';
import { UserappsModule } from './modules/userapps/userapps.module';
import { UsersModule } from './modules/users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // handle user input validation globaly
  app.useGlobalPipes(new ValidationPipe());
  // global prefix
  app.setGlobalPrefix('api/gym');

  // handle swagger (APIs doc)
  const options = new DocumentBuilder()
    .setTitle('GetCoach')
    .setDescription('A documentation for Gym app')
    .setVersion('1.0')
    // .addTag('Coaches')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [
      AuthModule,
      UsersModule,
      ProfilesModule,
      PhotosModule,
      UserappsModule,
      CoachappsModule,
      CoachProfilesModule,
      // CoachServicesModule,
      FullProgworkoutsModule,
      UserWorkoutsModule,
      DietprogramModule,
      UserDietsModule,
      AimsModule,
      SportsModule,
      UserProgressModule,
      CoachProgressModule,
      TemplateWorkoutsModule,
      TemplateDietsModule,
      ServicesModule,
      PublicationsModule,
      FeedbacksModule,
      PlacesModule,
      CoachNoatesModule,
      DietsModule,
      FaqModule,
      GetCaochFeedbackModule,
    ],
  });
  SwaggerModule.setup('api', app, document);
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
