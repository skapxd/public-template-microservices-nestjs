import { ValidationError } from '@nestjs/class-validator';
import {
  INestApplication,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { AllExceptionsHandler } from './all-exceptions-handler';
import { openApi } from './open-api';

export async function mainConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new UnprocessableEntityException(validationErrors);
      },
    }),
  );

  const httpRef = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsHandler(httpRef.httpAdapter.getHttpServer()),
  );

  if (process.env.NODE_ENV === 'test') return;
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'production') return;

  openApi(app);
  import('./generate-example-env');
  import('./generate-process-env');
  import('./generate-typescript-client');
}
