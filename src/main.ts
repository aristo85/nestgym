import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './modules/auth/auth.module';

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
    .build();

    const document = SwaggerModule.createDocument(app, options, {
      include: [AuthModule]
    });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
