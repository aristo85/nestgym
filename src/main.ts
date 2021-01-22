import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AimsModule } from './modules/aims/aims.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoachProfilesModule } from './modules/coach-modules/coach-profiles/coach-profiles.module';
import { CoachServicesModule } from './modules/coach-modules/coach-services/coach-services.module';
import { CoachappsModule } from './modules/coach-modules/coachapps/coachapps.module';
import { DietprogramModule } from './modules/coach-modules/dietprogram/dietprogram.module';
import { FullProgworkoutsModule } from './modules/coach-modules/full-progworkouts/full-progworkouts.module';
import { WorkoutProgramsModule } from './modules/coach-modules/workout-programs/workout-programs.module';
import { PhotosModule } from './modules/photos/photos.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SportsModule } from './modules/sports/sports.module';
import { UserDietsModule } from './modules/user-diets/user-diets.module';
import { UserProgressModule } from './modules/user-progress/user-progress.module';
import { UserWorkoutsModule } from './modules/user-workouts/user-workouts.module';
import { UserappsModule } from './modules/userapps/userapps.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // handle user input validation globaly
  app.useGlobalPipes(new ValidationPipe());
  // global prefix
  app.setGlobalPrefix('api/gym');

  // handle swagger (APIs doc)
  const options = new DocumentBuilder()
    .setTitle('Gym Coaches')
    .setDescription('A documentation for Gym app')
    .setVersion('1.0')
    .addTag('Coaches')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [
      AuthModule,
      ProfilesModule,
      PhotosModule,
      UserappsModule,
      CoachappsModule,
      CoachProfilesModule,
      CoachServicesModule,
      WorkoutProgramsModule,
      FullProgworkoutsModule,
      UserWorkoutsModule,
      DietprogramModule,
      AimsModule,
      SportsModule,
      UserDietsModule,
      UserProgressModule
    ],
  });
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
