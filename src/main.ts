import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
      prefix: 'Superchef',
      logLevels: process.env.LOG_LEVEL ? JSON.parse(process.env.LOG_LEVEL) : ['error', 'warn', 'log', 'debug', 'verbose'],
    }),
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

   const config = new DocumentBuilder()
    .setTitle('Super chef')
    .setDescription('Super chef docs')
    .setVersion('1.0')
    .addTag('superchef')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
