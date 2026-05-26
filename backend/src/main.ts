import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // Automatically transforms and converts types
      transform: true,

      // Strips away any properties that do not have any decorators in the DTO
      whitelist: true,

      // Throws an error if non-whitelisted properties are present in the payload
      forbidNonWhitelisted: true,

      // Forces validation of all properties, treating missing required fields as errors
      skipMissingProperties: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
