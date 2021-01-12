import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './modules/auth/auth.module';
import { PhotosModule } from './modules/photos/photos.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
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
    include: [AuthModule, ProfilesModule, UserappsModule, PhotosModule],
  });
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();