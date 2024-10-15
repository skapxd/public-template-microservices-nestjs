import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  Inject,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

import { getErrorDetail } from './get-error-detail';
import { sendReportMessage } from './send-report-message';

@Catch()
export class AllExceptionsHandler extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsHandler.name);

  constructor(@Inject(HttpAdapterHost) applicationRef: HttpServer) {
    super(applicationRef);
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const { url, method, headers, body } = request;

    const errorDetail = getErrorDetail(exception);

    const responseDetail =
      exception instanceof HttpException && exception.getResponse();

    try {
      const status =
        exception instanceof HttpException ? exception.getStatus() : 500;

      const log = {
        errorDetail: process.env.NODE_ENV === 'production' ? '' : errorDetail,
        responseDetail,
        url: `${method} -> ${url}`,
        status,
        body,
        headers,
      };

      const isDtoValidation = exception instanceof UnprocessableEntityException;
      if (!isDtoValidation)
        sendReportMessage({
          ...log,
          errorDetail,
        });

      this.logger.error(log);

      return response.status(status).json(log);
    } catch (error) {
      return response
        .status(500)
        .json(
          new InternalServerErrorException(
            (error as Error).message,
          ).getResponse(),
        );
    }
  }
}
