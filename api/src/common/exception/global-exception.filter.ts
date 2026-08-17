import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DtoErrorResponse } from '../interface/dto-error-response';
import { PostgresError } from '../interface/db_error';
import { DrizzleQueryError } from 'drizzle-orm';
import { getDbError } from '../errors/db-error-message';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string | string[];

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        message = (exceptionResponse as DtoErrorResponse).message;
      } else {
        message = 'Unknown Error';
      }

      const errorResponse = {
        statusCode: status,
        message,
        timestamp,
        path: request.path,
        method: request.method,
      };

      // 4xx = expected client error
      if (status >= 400 && status < 500) {
        this.logger.warn(
          `Request failed: ${request.method} ${request.path} - ${status}`,
        );
      } else {
        // 5xx HttpException
        this.logger.error(
          `Request failed: ${request.method} ${request.path} - ${status}`,
        );
      }

      response.status(status).json(errorResponse);
      return;
    } else if (exception instanceof DrizzleQueryError) {
      const cause = exception.cause;

      if (this.isPostgresError(cause)) {
        const dbError = getDbError(cause);

        this.logger.error(
          `Postgres error: ${cause.message ?? 'Unknown error'} ` +
            `code: ${cause.code} ` +
            `constraint: ${cause.constraint ?? 'none'}`,
        );

        response.status(dbError.statusCode).json({
          statusCode: dbError.statusCode,
          message: dbError.message,
          timestamp,
          path: request.path,
          method: request.method,
        });

        return;
      }
    }

    // Unexpected / unhandled error
    this.logger.error(
      `Unhandled exception: ${request.method} ${request.path}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      timestamp,
      path: request.path,
      method: request.method,
    });
  }

  private isPostgresError(exception: unknown): exception is PostgresError {
    if (!exception || typeof exception !== 'object') return false;

    const error = exception as PostgresError;

    return typeof error.code === 'string' && /^\d{5}$/.test(error.code);
  }
}
