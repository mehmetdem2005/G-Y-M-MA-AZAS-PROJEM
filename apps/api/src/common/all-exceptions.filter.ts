import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { captureException } from './monitoring';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) || 'n/a';
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';

    captureException(exception, {
      requestId,
      method: request.method,
      path: request.url,
      status,
    });

    console.error(
      JSON.stringify({
        level: 'error',
        requestId,
        method: request.method,
        path: request.url,
        status,
        message,
      }),
    );

    response.status(status).json({
      statusCode: status,
      requestId,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
