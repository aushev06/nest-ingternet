import dotenv = require('dotenv');
dotenv.config();
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const options = new DocumentBuilder()
    .setTitle('React Pizza API' + (process.env.NODE_ENV !== 'production' ? ' Sandbox' : ''))
    .setDescription('The React Pizza API description')
    .setVersion('[[BUILD_VERSION]]')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'React Pizza Api Swagger',
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.API_PORT || 3000, () => Logger.log('server started', 'Main'));
}

bootstrap();
