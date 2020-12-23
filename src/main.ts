import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //   handle user input validation globaly
  app.useGlobalPipes(new ValidationPipe());
  // global prefix
  app.setGlobalPrefix('api/gym');
  await app.listen(3000);
}
bootstrap();
