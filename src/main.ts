import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // transforma a como se requiere en los DTO's
    transformOptions: {
      enableImplicitConversion: true,
    }
    })
   );
  await app.listen(3000);
}
bootstrap();
