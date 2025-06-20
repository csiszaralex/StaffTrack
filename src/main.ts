import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './utils/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('START');
  const port: number = configService.get('port')!;

  CreateSwagger(app);

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(port, () => {
    logger.debug(`---------- Server started on port ${port} ----------`);
  });
}

function CreateSwagger(app: INestApplication) {
  const TITLE = 'StaffTracker webapp API';
  const configSW = new DocumentBuilder()
    .addBearerAuth()
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

void bootstrap();
