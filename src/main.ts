import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';   // 👈 اینو اضافه کن
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // فعال‌سازی CORS با پیکربندی مناسب
  app.enableCors({
    origin: 'http://localhost:1406', // آدرس پروژه فرانت‌اند (مثلاً Nuxt یا React)
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // افزایش محدودیت اندازه Body
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(express.static('F:/Project/MyDevelopment/PV/20Vision/20Vision-Folk-Backend/src'));

  const config = new DocumentBuilder()
    .setTitle('20Vision Art Backend API')
    .setDescription('The 20Vision Art Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh',
        description: 'Enter refresh token',
        in: 'header',
      },
      'JWT-refresh',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(1015);
}
bootstrap();
