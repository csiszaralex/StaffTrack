import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  CreateSwagger(app);

  await app.listen(port);
}

async function CreateSwagger(app: INestApplication) {
  const TITLE = 'StaffTracker webapp API';
  const configSW = new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription("A webapplication's API for tracking staff")
    .setVersion(process.env.npm_package_version || '0.1.0')
    .build();
  const documentOptions: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };
  const customOptions: SwaggerCustomOptions = {
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customSiteTitle: TITLE,
  };

  const document = SwaggerModule.createDocument(app, configSW, documentOptions);
  SwaggerModule.setup('api', app, document, customOptions);
}

bootstrap();
